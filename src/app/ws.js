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
import { updateSeeTotalScore, resetMisc } from "./redux/slices/misc.js";

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
      if (!ws.uuid) {
        socketConnected();
      }
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
     * When party start
     */
    socket.on("startGame", (party) => {
      dispatch(refreshParty({ party }));
    });
    /**
     * When party stop
     */
    socket.on("viewResults", (party) => {
      dispatch(refreshParty({ party }));
    });
    /**
     *
     */
    socket.on("gameIsFinish", ({ canSeeTotalScore }) => {
      dispatch(updateSeeTotalScore(canSeeTotalScore));
    });
    /**
     * Disconnect
     */
    socket.on("disconnect", () => {
      dispatch(resetWs());
      dispatch(resetUser());
      dispatch(resetParty());
      dispatch(resetServer());
      dispatch(resetMisc());
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
      initMainThread();
    }
  }, [ws]);

  const ALLOWED_PATH = ["/r/", "/flash"];
  let path = window.location.pathname;

  let isPathAllowed = ALLOWED_PATH.map((p) => path.includes(p)).includes(true);

  useEffect(() => {
    if (isPathAllowed) {
      initMainThread();
      return;
    }
    if (!lod_.isEmpty(state.party) && state.party.status === "results") {
      /**
       * View party results
       */
      navigate("/results");
    } else if (!lod_.isEmpty(state.party) && state.party.status === "playing") {
      /**
       * If party playing, go to party
       */
      navigate("/game");
    } else if (!lod_.isEmpty(state.party) && state.misc.canSeeTotalScore) {
      /**
       * If party is ended, go to scoreboard
       */
      navigate("/scoreboard");
    } else if (!lod_.isEmpty(state.party)) {
      /**
       * If party, go to party's room
       */
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
