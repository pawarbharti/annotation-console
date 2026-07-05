import { WebSocketEvent } from "@/types/websocket";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

export function connectWebSocket(
  onMessage: (event: WebSocketEvent) => void
) {
  let socket: WebSocket;
  let reconnectTimer: NodeJS.Timeout | null = null;

  function connect() {
    console.log("Connecting to:", WS_URL);

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as WebSocketEvent;
      onMessage(data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error", error);
    };

    socket.onclose = () => {
      console.log("⚠️ WebSocket Closed");

      reconnectTimer = setTimeout(() => {
        console.log("🔄 Reconnecting...");
        connect();
      }, 2000);
    };
  }

  connect();

  return {
    close() {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      socket.close();
    },
  };
}