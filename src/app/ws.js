/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { connect, resetWs } from "./redux/slices/ws.js";
import { SocketContext } from "./context/ws";
import { v4 as uuidv4 } from "uuid";
import { login, refresh, resetUser } from "./redux/slices/user.js";
import { resetParty } from "./redux/slices/party.js";
import {
  resetServer,
  updateParties,
  updateUser,
} from "./redux/slices/server.js";
import lod_ from "lodash";

const WebSockets = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ws } = useSelector((state) => state);
  const state = useSelector((state) => state);

  function socketConnected() {
    let userUUID = uuidv4();
    socket.uuid = userUUID;
    dispatch(connect(userUUID));
    /**
     * Send the uuid to the server
     */
    socket.emit("saveUser", { uuid: userUUID });
  }

  function initMainThread() {
    /**
     * When socket is connected, store random uuid linked to the user, used for requests
     */
    socket.on("connect", () => {
      socketConnected();
    });
    /**
     * Used to change the page
     */
    socket.on("changePage", ({ page }) => {
      navigate(`/${page}`);
    });
    /**
     * Refresh user's data
     */
    socket.on("refreshUser", ({ user }) => {
      dispatch(refresh({ user }));
    });
    /**
     * Update online users
     */
    console.log("listen socket users online");
    socket.on("updateOnlineUsers", ({ onlineUsers }) => {
      console.log("updateOnlineUsers", onlineUsers);
      dispatch(updateUser({ onlineUsers }));
    });
    /**
     * Update online parties
     */
    socket.on("updateOnlineParties", ({ parties }) => {
      dispatch(updateParties({ parties }));
    });
    /**
     * Disconnect
     */
    socket.on("disconnect", () => {
      dispatch(resetWs());
      dispatch(resetUser());
      dispatch(resetParty());
      dispatch(resetServer());
    });
  }

  /**
   * On init
   */
  useEffect(() => {
    console.log("use effect");
    if (!ws.uuid) {
      initMainThread();
    } else {
      /**
       * If user reload the page, save new socket connection to the server
       */
      console.log("Save user", ws.uuid);
      socket.emit("saveUser", { uuid: ws.uuid });
    }
  }, [ws]);

  useEffect(() => {
    /**
     * If party, go to party's room
     */
    if (!lod_.isEmpty(state.party)) {
      navigate("/waiting");
    } else if (!lod_.isEmpty(state.user)) {
      /**
       * If user, go to lobby
       */
      navigate("/lobby");
    } else if (state.ws.uuid) {
      /**
       * If ws uuid, go to login
       */
      navigate("/login");
    } else {
      /**
       * Else, go to /
       */
      navigate("/");
      if (!ws.uuid) {
        socketConnected();
      }
    }
  }, [state]);
};

export default WebSockets;
