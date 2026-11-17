BEGIN TRY
    SET IDENTITY_INSERT dbo.Sports ON;

    INSERT INTO dbo.Sports (Id, Name)
    SELECT source.Id, source.Name
    FROM (VALUES
        (1,  N'Piłka nożna'),
        (2,  N'Siatkówka'),
        (3,  N'Koszykówka'),
        (4,  N'Piłka ręczna'),
        (5,  N'Tenis'),
        (6,  N'Bieganie'),
        (7,  N'Kolarstwo'),
        (8,  N'Pływanie'),
        (9,  N'Boks'),
        (10, N'MMA'),
        (11, N'Hokej na lodzie'),
        (12, N'Tenis stołowy'),
        (13, N'Badminton'),
        (14, N'Narciarstwo biegowe'),
        (15, N'Łyżwiarstwo'),
        (16, N'Podnoszenie ciężarów'),
        (17, N'Golf'),
        (18, N'Rugby')
    ) AS source(Id, Name)
    WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.Sports existing
        WHERE existing.Id = source.Id
    );

    SET IDENTITY_INSERT dbo.Sports OFF;
END TRY
BEGIN CATCH
    SET IDENTITY_INSERT dbo.Sports OFF;
    THROW;
END CATCH;