/*
  SportLinker / SQL Server: 50 ofert do testowania wyszukiwania i paginacji.
  Uruchom w SSMS / Azure Data Studio po wybraniu bazy SportLinkera.
  @CommitChanges = 1 zapisuje dane; 0 pokazuje wynik i wycofuje transakcję.

  - Autorzy: istniejący użytkownicy o ID 1–7, przydzielani naprzemiennie.
  - Sporty: wyłącznie rekordy istniejące w dbo.Sports (bez założeń o ID).
  - Każda oferta ma tylko autora jako uczestnika i własny czat grupowy.
  - Wszystkie oferty są dostępne, a terminy wypadają w następnych 28 dniach.
  - Terminy 16:00–20:45 czasu polskiego są zapisywane w UTC.
  - Stałe znaczniki [DEMO50-01]–[DEMO50-50] zapobiegają duplikatom.
    Istniejące oferty nie są zmieniane, również po kolejnym uruchomieniu.
*/
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @CommitChanges bit = 1;
DECLARE @NowUtc datetime2(7) = SYSUTCDATETIME();
DECLARE @PolishToday date = CONVERT(date,
    @NowUtc AT TIME ZONE 'UTC' AT TIME ZONE 'Central European Standard Time');
DECLARE @Skipped int = 0;

DECLARE @Authors TABLE (Number int PRIMARY KEY, UserId int NOT NULL);
DECLARE @Sports TABLE (Number int PRIMARY KEY, SportId int NOT NULL, SportName nvarchar(100) NOT NULL);
DECLARE @Places TABLE (
    Number int PRIMARY KEY,
    City nvarchar(100) NOT NULL,
    State nvarchar(100) NOT NULL,
    Latitude float NOT NULL,
    Longitude float NOT NULL
);
DECLARE @Created TABLE (
    Number int PRIMARY KEY,
    OfferId int NOT NULL,
    AuthorId int NOT NULL,
    ConversationId int NOT NULL,
    Title nvarchar(50) NOT NULL,
    City nvarchar(100) NOT NULL,
    PlanningDateUtc datetime2(7) NOT NULL
);

-- Współrzędne przybliżają centra miast; to przykładowe miejsca spotkań.
-- Kraj i województwa zapisujemy tak jak dane lokalizacji używane przez aplikację.
INSERT INTO @Places (Number, City, State, Latitude, Longitude) VALUES
    (1,  N'Wrocław',   N'Lower Silesian Voivodeship', 51.1079, 17.0385),
    (2,  N'Warszawa',  N'Masovian Voivodeship',       52.2297, 21.0122),
    (3,  N'Kraków',    N'Lesser Poland Voivodeship',  50.0647, 19.9450),
    (4,  N'Gdańsk',    N'Pomeranian Voivodeship',     54.3520, 18.6466),
    (5,  N'Poznań',    N'Greater Poland Voivodeship', 52.4064, 16.9252),
    (6,  N'Łódź',      N'Łódź Voivodeship',           51.7592, 19.4560),
    (7,  N'Katowice',  N'Silesian Voivodeship',       50.2649, 19.0238),
    (8,  N'Lublin',    N'Lublin Voivodeship',         51.2465, 22.5684),
    (9,  N'Szczecin',  N'West Pomeranian Voivodeship',53.4285, 14.5528),
    (10, N'Białystok', N'Podlaskie Voivodeship',      53.1325, 23.1688);

BEGIN TRY
    BEGIN TRANSACTION;

    -- Drugi egzemplarz tego skryptu poczeka, zamiast utworzyć tę samą partię.
    DECLARE @LockResult int;
    EXEC @LockResult = sys.sp_getapplock
        @Resource = N'SportLinker.SeedDemoOffers50',
        @LockMode = 'Exclusive',
        @LockOwner = 'Transaction',
        @LockTimeout = 10000;
    IF @LockResult < 0
        THROW 50001, N'Nie udało się uzyskać blokady tworzenia danych demo.', 1;

    INSERT INTO @Authors (Number, UserId)
    SELECT CONVERT(int, ROW_NUMBER() OVER (ORDER BY Id)), Id
    FROM dbo.Users
    WHERE Id BETWEEN 1 AND 7;

    INSERT INTO @Sports (Number, SportId, SportName)
    SELECT CONVERT(int, ROW_NUMBER() OVER (ORDER BY Id)), Id, Name
    FROM dbo.Sports;

    DECLARE @AuthorCount int = (SELECT COUNT(*) FROM @Authors);
    DECLARE @SportCount int = (SELECT COUNT(*) FROM @Sports);
    IF @AuthorCount = 0
        THROW 50002, N'W bazie musi istnieć przynajmniej jeden użytkownik o ID 1–7.', 1;
    IF @SportCount = 0
        THROW 50003, N'Najpierw dodaj przynajmniej jeden sport do tabeli dbo.Sports.', 1;

    DECLARE @Number int = 1;
    WHILE @Number <= 50
    BEGIN
        DECLARE @Marker nvarchar(20) = N'[DEMO50-' + RIGHT(N'0' + CONVERT(nvarchar(2), @Number), 2) + N']';

        IF EXISTS (SELECT 1 FROM dbo.Offers WHERE LEFT(Title, LEN(@Marker)) = @Marker)
            SET @Skipped += 1;
        ELSE
        BEGIN
            DECLARE @AuthorId int;
            DECLARE @SportId int;
            DECLARE @SportName nvarchar(100);
            DECLARE @City nvarchar(100);
            DECLARE @State nvarchar(100);
            DECLARE @Latitude float;
            DECLARE @Longitude float;
            SELECT @AuthorId = UserId FROM @Authors WHERE Number = ((@Number - 1) % @AuthorCount) + 1;
            SELECT @SportId = SportId, @SportName = SportName FROM @Sports
            WHERE Number = ((@Number - 1 + ((@Number - 1) / 10)) % @SportCount) + 1;
            SELECT @City = City, @State = State, @Latitude = Latitude, @Longitude = Longitude
            FROM @Places WHERE Number = ((@Number - 1) % 10) + 1;

            DECLARE @PlaceName nvarchar(100) = N'Punkt spotkania - ' + @City;
            DECLARE @LocationId int = NULL;
            SELECT TOP (1) @LocationId = Id
            FROM dbo.Locations
            WHERE Country = N'Poland' AND State = @State AND City = @City
                AND Name = @PlaceName AND Type = N'city'
            ORDER BY Id;

            IF @LocationId IS NULL
            BEGIN
                INSERT INTO dbo.Locations
                    (Country, State, City, Name, Street, HouseNumber, Type, Coordinates_Latitude, Coordinates_Longitude)
                VALUES
                    (N'Poland', @State, @City, @PlaceName, N'', N'', N'city', @Latitude, @Longitude);
                SET @LocationId = CONVERT(int, SCOPE_IDENTITY());
            END;

            DECLARE @LocalPlanningDate datetime2(7) = DATEADD(MINUTE, (@Number % 4) * 15,
                DATEADD(HOUR, 16 + (@Number % 5),
                    DATEADD(DAY, 1 + ((@Number - 1) % 28), CONVERT(datetime2(7), @PolishToday))));
            DECLARE @PlanningDateUtc datetime2(7) = CONVERT(datetime2(7),
                @LocalPlanningDate AT TIME ZONE 'Central European Standard Time' AT TIME ZONE 'UTC');
            DECLARE @Title nvarchar(50) = @Marker + N' ' + LEFT(@SportName, 18) + N' - ' + @City;
            DECLARE @Description nvarchar(190) = N'Oferta testowa: wspólna aktywność sportowa w mieście ' + @City
                + N'. Szukamy chętnych do regularnej gry i treningu. Na razie dołączył tylko organizator.';
            DECLARE @Level nvarchar(20) = CASE (@Number - 1 + ((@Number - 1) / 10)) % 4
                WHEN 0 THEN N'Beginner' WHEN 1 THEN N'Intermediate' WHEN 2 THEN N'Expert' ELSE N'Any' END;
            DECLARE @Mode nvarchar(20) = CASE WHEN (@Number + ((@Number - 1) / 10)) % 5 = 0 THEN N'Private' ELSE N'Public' END;
            DECLARE @MaxPeople int = 2 + ((@Number - 1) % 6) * 2;

            INSERT INTO dbo.Offers
                (Title, Description, Level, PlanningDate, CreatedAt, MaxPeople, Availability, Mode, SportId, LocationId, AuthorId)
            VALUES
                (@Title, @Description, @Level, @PlanningDateUtc, @NowUtc, @MaxPeople, N'Available', @Mode, @SportId, @LocationId, @AuthorId);
            DECLARE @OfferId int = CONVERT(int, SCOPE_IDENTITY());

            INSERT INTO dbo.OfferParticipants (OfferId, UserId, JoinDate)
            VALUES (@OfferId, @AuthorId, @NowUtc);

            -- Odpowiednik CreateGroupConversationOnOfferCreatedHandler.
            INSERT INTO dbo.Conversations (RelatedOfferId, Type, PrivateConversationPairKey, CreatedAt)
            VALUES (@OfferId, N'Group', NULL, @NowUtc);
            DECLARE @ConversationId int = CONVERT(int, SCOPE_IDENTITY());
            INSERT INTO dbo.ConversationParticipants (ConversationId, UserId, JoinedAt, LeftAt)
            VALUES (@ConversationId, @AuthorId, @NowUtc, NULL);

            INSERT INTO @Created (Number, OfferId, AuthorId, ConversationId, Title, City, PlanningDateUtc)
            VALUES (@Number, @OfferId, @AuthorId, @ConversationId, @Title, @City, @PlanningDateUtc);
        END;

        SET @Number += 1;
    END;

    -- OfferCreated zwiększa wyłącznie CreatedOffers. Autor nie generuje ParticipantJoined.
    UPDATE u
    SET Statistics_CreatedOffers = COALESCE(u.Statistics_CreatedOffers, 0) + created.Amount
    FROM dbo.Users u
    INNER JOIN (SELECT AuthorId, COUNT(*) AS Amount FROM @Created GROUP BY AuthorId) created
        ON created.AuthorId = u.Id;

    IF EXISTS (
        SELECT created.OfferId
        FROM @Created created
        LEFT JOIN dbo.OfferParticipants participant ON participant.OfferId = created.OfferId
        GROUP BY created.OfferId, created.AuthorId
        HAVING COUNT(participant.Id) <> 1 OR MIN(participant.UserId) <> created.AuthorId
    )
        THROW 50004, N'Niepoprawna lista uczestników wygenerowanych ofert.', 1;

    SELECT DB_NAME() AS DatabaseName,
        (SELECT COUNT(*) FROM @Created) AS CreatedOffers,
        @Skipped AS SkippedExistingOffers,
        @CommitChanges AS WillCommit;
    SELECT Number, OfferId, AuthorId, ConversationId, Title, City, PlanningDateUtc,
        PlanningDateUtc AT TIME ZONE 'UTC' AT TIME ZONE 'Central European Standard Time' AS PlanningDatePoland
    FROM @Created
    ORDER BY Number;

    IF @CommitChanges = 1
        COMMIT TRANSACTION;
    ELSE
        ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
