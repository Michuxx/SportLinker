import { useEffect, useMemo, useRef, useState } from "react";
import userService from "../api/userService";
import { collectChatImages } from "../utils/chatImages";

const useChatImages = ({ user, friends, conversations, messages, activeChat }) => {
  const userId = user?.id;
  const sources = useMemo(() => collectChatImages({ user, friends, conversations, messages, activeChat }), [user, friends, conversations, messages, activeChat]);
  const [cache, setCache] = useState({ userId: null, images: {} });
  const sessionRef = useRef(null);

  useEffect(() => {
    const session = { controller: new AbortController(), requested: new Set() };
    sessionRef.current = session;
    setCache({ userId, images: {} });
    return () => session.controller.abort();
  }, [userId]);

  useEffect(() => {
    const session = sessionRef.current;
    if (!userId || !session || session.controller.signal.aborted) return;
    for (const id of sources.ids) {
      if (sources.known[id] || session.requested.has(id)) continue;
      session.requested.add(id);
      const loadImage = async () => {
        let image = null;
        try {
          // This ID identifies the viewed profile; the API reads the viewer from claims.
          const profile = await userService.getUserData(id, { signal: session.controller.signal });
          image = profile.profileImage ?? null;
        } catch {
          // An unavailable/deleted profile keeps the standard avatar without failing the chat.
        }
        if (!session.controller.signal.aborted) setCache((previous) => previous.userId === userId ? { ...previous, images: { ...previous.images, [id]: image } } : previous);
      };
      loadImage();
    }
  }, [userId, sources]);

  return { ...(cache.userId === userId ? cache.images : {}), ...sources.known };
};

export default useChatImages;
