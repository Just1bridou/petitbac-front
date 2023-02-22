/* eslint-disable react-hooks/rules-of-hooks */
import socketio from "socket.io-client";
import { createContext } from "react";
const ENDPOINT = process.env.REACT_APP_BACK;

console.log("CONNECT TO BACKEND: ", ENDPOINT);

export const socket = socketio.connect(ENDPOINT);
export const SocketContext = createContext();
