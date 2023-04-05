import "./style.scss";

import logo from "../../app/assets/images/logo.png";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import lod_ from "lodash";
import { SocketContext } from "../../app/context/ws";

import { useDispatch } from "react-redux";
import { resetWs } from "../../app/redux/slices/ws.js";
import { resetUser } from "../../app/redux/slices/user.js";
import { resetParty } from "../../app/redux/slices/party.js";
import { resetServer } from "../../app/redux/slices/server.js";
import { Chat as ComponentChat } from "../../components/chat";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightFromBracket, faCrown } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Tooltip } from "@mui/material";
import { useContext, useState } from "react";
import { PrimaryButton, SpecialButton } from "../buttons";
import { Chat, Link } from "@carbon/icons-react";
library.add(faRightFromBracket);

const UserBox = ({ user, icon, isReady, secondLine = null }) => {
  return (
    <Tooltip placement="top" title={user.pseudo}>
      <div className="userBox">
        <div
          className="userBoxAvatar"
          style={{
            backgroundColor: isReady ? "#36a10d" : "",
          }}
        >
          {user?.pseudo[0]?.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",

            marginLeft: "1vw",
            flex: 1,
          }}
        >
          <div className="userBoxNameContainer">
            <div className="userBoxName">{user.pseudo}</div>
            <div className="userBoxIcon">{icon}</div>
          </div>
          {secondLine}
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
  const [openChat, setOpenChat] = useState(false);
  const { party, user } = useSelector((state) => state);
  const actualUser = useSelector((state) => state.user);
  const socket = useContext(SocketContext);
  if (lod_.isEmpty(party)) return null;

  const copyActualUrlToClipboard = () => {
    const url = window.location.origin + "/r/" + party.uuid;
    copyToClipboard(url);
  };

  const unsecuredCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = (content) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content);
    } else {
      unsecuredCopyToClipboard(content);
    }
  };

  return (
    <div className="multiColumn">
      <ComponentChat
        openChat={openChat}
        closeChat={() => setOpenChat(false)}
        onClick={() => setOpenChat(true)}
        noButton
      />
      <div className="columnDivider">
        <div>
          {party.users?.map((user, index) => {
            let icon = null;

            if (actualUser.admin) {
              icon = (
                <Tooltip placement="left" title="Exclure">
                  <IconButton
                    size="small"
                    onClick={() => {
                      socket.emit("kickUser", {
                        partyUUID: party.uuid,
                        uuid: user.uuid,
                      });
                    }}
                  >
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

            return (
              <UserBox
                key={index}
                user={user}
                icon={icon}
                isReady={user.ready}
              />
            );
          })}
        </div>
        <div className="waitingButtonsContainer">
          <Tooltip
            placement="top"
            title="Partager le lien de la partie"
            style={{
              marginRight: "10px",
            }}
          >
            <span>
              <SpecialButton
                icon
                variant="pink"
                value={<Link width={24} height={24} />}
                onClick={copyActualUrlToClipboard}
                style={{
                  borderRadius: "15px",
                }}
              />
            </span>
          </Tooltip>
          <PrimaryButton
            value={
              party.users?.find((u) => u.uuid === user.uuid).ready
                ? "Annuler"
                : "Prêt"
            }
            style={{
              flex: 1,
              fontSize: "20px",
              borderRadius: "15px",
            }}
            onClick={() => {
              socket.emit("readyUser", {
                partyUUID: party.uuid,
                uuid: user.uuid,
              });
            }}
          />
          <SpecialButton
            icon
            variant="green"
            value={<Chat width={24} height={24} />}
            onClick={() => {
              setOpenChat(true);
            }}
            style={{
              marginLeft: "10px",
              borderRadius: "15px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const GamePannel = () => {
  const { party } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  if (lod_.isEmpty(party)) return null;

  return (
    <div className="multiColumn">
      <div className="columnDivider">
        <div>
          {party.users?.map((user, index) => {
            let userScore = party.score.find(
              (score) => score.uuid === user.uuid
            );
            return (
              <UserBox
                key={index}
                user={user}
                secondLine={
                  <div className="userScore">
                    {userScore?.score ?? 0}
                    <span className="pts">pts</span>
                  </div>
                }
              />
            );
          })}
        </div>
        <SpecialButton
          value="STOP"
          style={{
            width: "100%",
            fontSize: "20px",
          }}
          onClick={() => {
            socket.emit("stopGame", {
              uuid: party.uuid,
            });
          }}
        />
      </div>
    </div>
  );
};

const ResultsPannel = () => {
  const { party, user } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  if (lod_.isEmpty(party)) return null;

  return (
    <div className="multiColumn">
      <div className="columnDivider">
        <div>
          {party.users?.map((user, index) => {
            let userScore = party.score.find(
              (score) => score.uuid === user.uuid
            );
            return (
              <UserBox
                key={index}
                user={user}
                secondLine={
                  <div className="userScore">
                    {userScore?.score ?? 0}
                    <span className="pts">pts</span>
                  </div>
                }
                isReady={user.ready}
              />
            );
          })}
        </div>
        <SpecialButton
          value="Suivant"
          style={{
            width: "100%",
            fontSize: "20px",
          }}
          onClick={() => {
            socket.emit("nextRound", {
              partyUUID: party.uuid,
              uuid: user.uuid,
            });
          }}
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
  const { ws, party, user } = useSelector((state) => state);

  const socket = useContext(SocketContext);

  function switchPathName() {
    switch (pathname) {
      case "/lobby":
        return <LobbyPannel />;
      case "/waiting":
        return <WaitingPannel />;
      case "/game":
        return <GamePannel />;
      case "/results":
        return <ResultsPannel />;
      default:
        return null;
    }
  }

  function bottomPannel() {
    switch (pathname) {
      case "/waiting":
      case "/game":
      case "/results":
        return `${party?.users?.length} Joueurs`;
      default:
        return `${onlineUsers} Joueurs en ligne`;
    }
  }

  function bottomButton() {
    switch (pathname) {
      case "/lobby":
        return (
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
        );
      default:
        return (
          <Tooltip placement="left" title="Quitter">
            <IconButton
              size="small"
              onClick={() => {
                socket.emit("userLeaveParty", {
                  partyUUID: party.uuid,
                  uuid: user.uuid,
                });
                dispatch(resetParty());
              }}
            >
              <FontAwesomeIcon icon="right-from-bracket" />
            </IconButton>
          </Tooltip>
        );
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
          zIndex: "10",
        }}
      >
        <img
          style={{
            height: "auto",
            width: "10vw",
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
          zIndex: "10",
        }}
      >
        <div className="onlineUsers">{bottomPannel()}</div>
        <div
          className="buttonOption"
          style={{
            position: "absolute",
            bottom: "15px",
            right: "20px",
          }}
        >
          {bottomButton()}
        </div>
      </div>

      <div className="lightOne"></div>
      <div className="lightTwo"></div>
    </div>
  );
};
