/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { connect, resetWs } from "./redux/slices/ws.js";
import { SocketContext } from "./context/ws";
import { v4 as uuidv4 } from "uuid";
import { login, refresh, resetUser } from "./redux/slices/user.js";
import { resetParty, refreshParty } from "./redux/slices/party.js";
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
    dispatch(connect(userUUID));
    /**
     * Send the uuid to the server
     */
    socket.emit("saveUser", { uuid: userUUID });
  }

  function initMainThread() {
    socket.removeAllListeners();
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
    socket.on("updateOnlineUsers", ({ onlineUsers }) => {
      dispatch(updateUser({ onlineUsers }));
    });
    /**
     * Update online parties
     */
    socket.on("updateOnlineParties", ({ parties }) => {
      dispatch(updateParties({ parties }));
    });
    /**
     * Update party's data
     */
    socket.on("updateParty", ({ party }) => {
      dispatch(refreshParty({ party }));
    });
    /**
     * When user is kicked from the party
     */
    socket.on("kickParty", () => {
      dispatch(resetParty());
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
    if (!ws.uuid) {
      initMainThread();
    } else {
      /**
       * If user reload the page, save new socket connection to the server
       */
      socket.emit("saveUser", { uuid: ws.uuid });
    }
  }, [ws]);

  const ALLOWED_PATH = ["/r/"];
  let path = window.location.pathname;

  let isPathAllowed = ALLOWED_PATH.map((p) => path.includes(p)).includes(true);

  useEffect(() => {
    if (isPathAllowed) {
      initMainThread();
    }
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
    } else if (state.ws.uuid && !isPathAllowed) {
      /**
       * If ws uuid, go to login
       */
      navigate("/login");
    } else if (!isPathAllowed) {
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
