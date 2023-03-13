/* eslint-disable react-hooks/rules-of-hooks */
import io from "socket.io-client";
import { createContext } from "react";
const HOST = process.env.REACT_APP_BACK_HOST;

let conStr;

if (HOST.includes("localhost") || HOST.includes("127.0.0.1")) {
  conStr = `http://${HOST}`;
} else {
  conStr = `https://${HOST}`;
}

export const socket = io(conStr, { secure: true });
export const SocketContext = createContext();
