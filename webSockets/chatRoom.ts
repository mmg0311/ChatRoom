import {
  WebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
let sockets = new Map<string, WebSocket>();

interface objType {
  name: string;
  mssg: string;
}

const broadcastEvent = (obj: objType) => {
  sockets.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(obj));
  });
};

const chatConnection = async (ws: WebSocket) => {
  const uid = v4.generate();
  sockets.set(uid, ws);
  for await (const ev of ws) {
    console.log(ev);
    if (isWebSocketCloseEvent(ev)) {
      sockets.delete(uid);
    }
    if (typeof ev === "string") {
      let evObj = JSON.parse(ev);
      broadcastEvent(evObj);
    }
  }
};

export { chatConnection };
