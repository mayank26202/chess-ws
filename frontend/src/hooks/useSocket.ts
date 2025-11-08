import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("disconnected");
      setSocket(null);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    // cleanup
    return () => {
      try {
        ws.close();
      } catch (e) { /* ignored */ }
      setSocket(null);
    };
  }, []);

  return socket;
};
