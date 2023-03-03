/* eslint-disable react-hooks/rules-of-hooks */
import socketio from "socket.io-client";
import { createContext } from "react";
const HOST = process.env.REACT_APP_BACK_HOST;
const PORT = process.env.REACT_APP_BACK_PORT;

//let conStr = `http://${HOST}:${PORT}`
let conStr = `https://${HOST}`

export const socket = socketio.connect(conStr);
export const SocketContext = createContext();
