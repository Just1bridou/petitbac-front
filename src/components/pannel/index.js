import "./style.css";

import logo from "../../app/assets/images/logo.png";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import lod_ from "lodash";
import { SocketContext } from "../../app/context/ws";

import { useDispatch } from "react-redux";
import { resetWs } from "../../app/redux/slices/ws.js";
import { resetUser } from "../../app/redux/slices/user.js";
import { resetParty } from "../../app/redux/slices/party.js";
import { resetServer } from "../../app/redux/slices/server.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
library.add(faRightFromBracket);

const UserBox = ({ user }) => {
  return (
    <Tooltip placement="top" title={user.pseudo}>
      <div
        style={{
          width: "80%",
          backgroundColor: "#D9D9D9",
          borderRadius: "20px",
          padding: "1.5vh 1vw",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            width: "5vh",
            height: "5vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "rgba(217, 217, 217, 1)",
            backgroundColor: "rgba(1, 22, 56, 1)",
            borderRadius: "100px",
          }}
        >
          {user?.pseudo[0]?.toUpperCase()}
        </div>
        <div
          style={{
            marginLeft: "1vw",
            fontSize: "25px",
            fontWeight: "bold",
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "13vw",
            height: "1.2em",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          {user.pseudo}
        </div>
      </div>
    </Tooltip>
  );
};

const LobbyPannel = () => {
  const { user } = useSelector((state) => state);
  if (lod_.isEmpty(user)) return null;
  return <UserBox user={user} />;
};

export const Pannel = () => {
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((state) => state.server);
  const { pathname } = useLocation();
  const { ws } = useSelector((state) => state);

  const socket = useContext(SocketContext);

  function switchPathName() {
    switch (pathname) {
      case "/lobby":
        return <LobbyPannel />;
      default:
        return null;
    }
  }

  return (
    <div className="pannel">
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          style={{
            height: "auto",
            width: "15vw",
            contentFit: "contain",
            marginBottom: "4vh",
          }}
          src={logo}
          alt="logo"
        ></img>
        {switchPathName()}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="divider"></div>
        <div className="onlineUsers">{`${onlineUsers} Joueurs en ligne`}</div>
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            right: "20px",
          }}
        >
          <Tooltip placement="left" title="Se déconnecter">
            <IconButton
              size="small"
              onClick={() => {
                dispatch(resetWs());
                dispatch(resetUser());
                dispatch(resetParty());
                dispatch(resetServer());
                socket.emit("disconnected", { uuid: ws.uuid });
              }}
            >
              <FontAwesomeIcon icon="right-from-bracket" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
