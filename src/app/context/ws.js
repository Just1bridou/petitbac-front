/* eslint-disable react-hooks/rules-of-hooks */
import socketio from "socket.io-client";
import { createContext } from "react";
const HOST = process.env.REACT_APP_BACK_HOST;
const PORT = process.env.REACT_APP_BACK_PORT;

console.log("CONNECT TO BACKEND: ", `http://${HOST}:${PORT}`);

export const socket = socketio.connect(`http://${HOST}:${PORT}`);
export const SocketContext = createContext();
