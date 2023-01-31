import "./style.css";

import logo from "../../app/assets/images/logo.png";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import lod_ from "lodash";
import { SocketContext } from "../../app/context/ws";

import { useDispatch } from "react-redux";
import { resetWs } from "../../app/redux/slices/ws.js";
import { resetUser } from "../../app/redux/slices/user.js";
import { resetParty } from "../../app/redux/slices/party.js";
import { resetServer } from "../../app/redux/slices/server.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightFromBracket, faCrown } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
import { SpecialButton } from "../buttons";
library.add(faRightFromBracket);

const UserBox = ({ user, icon }) => {
  return (
    <Tooltip placement="top" title={user.pseudo}>
      <div className="userBox">
        <div className="userBoxAvatar">{user?.pseudo[0]?.toUpperCase()}</div>
        <div className="userBoxNameContainer">
          <div className="userBoxName">{user.pseudo}</div>
          {icon}
        </div>
      </div>
    </Tooltip>
  );
};

const LobbyPannel = () => {
  const { user } = useSelector((state) => state);
  if (lod_.isEmpty(user)) return null;

  return (
    <div className="multiColumn">
      <UserBox user={user} />
    </div>
  );
};

const WaitingPannel = () => {
  const { party } = useSelector((state) => state);
  const actualUser = useSelector((state) => state.user);
  if (lod_.isEmpty(party)) return null;

  return (
    <div className="multiColumn">
      <div className="columnDivider">
        <div>
          {party.users.map((user, index) => {
            let icon = null;

            if (actualUser.admin) {
              icon = (
                <Tooltip placement="left" title="Exclure">
                  <IconButton size="small" onClick={() => {}}>
                    <FontAwesomeIcon icon="right-from-bracket" />
                  </IconButton>
                </Tooltip>
              );
            }

            if (user.admin) {
              icon = (
                <Tooltip placement="left" title="Administrateur">
                  <FontAwesomeIcon icon={faCrown} />
                </Tooltip>
              );
            }

            return <UserBox key={index} user={user} icon={icon} />;
          })}
        </div>
        <SpecialButton
          value="Prêt"
          style={{
            width: "100%",
            fontSize: "20px",
          }}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export const Pannel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { onlineUsers } = useSelector((state) => state.server);
  const { pathname } = useLocation();
  const { ws, party } = useSelector((state) => state);

  const socket = useContext(SocketContext);

  function switchPathName() {
    switch (pathname) {
      case "/lobby":
        return <LobbyPannel />;
      case "/waiting":
        return <WaitingPannel />;
      default:
        return null;
    }
  }

  function bottomPannel() {
    switch (pathname) {
      case "/waiting":
        return `${party?.users?.length} Joueurs`;
      default:
        return `${onlineUsers} Joueurs en ligne`;
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
          height: "100%",
          marginBottom: "5px",
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
        <div className="onlineUsers">{bottomPannel()}</div>
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
                navigate("/");
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
