import "./style.scss";

import logo from "../../app/assets/images/logo.png";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import lod_ from "lodash";
import { SocketContext } from "../../app/context/ws";

import { useDispatch } from "react-redux";
import { resetWs } from "../../app/redux/slices/ws.js";
import { resetUser } from "../../app/redux/slices/user.js";
import { refreshParty, resetParty } from "../../app/redux/slices/party.js";
import { resetServer } from "../../app/redux/slices/server.js";
import { Chat as ComponentChat } from "../../components/chat";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightFromBracket, faCrown } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button, IconButton, Tooltip } from "@mui/material";
import { useContext, useState } from "react";
import { PrimaryButton, SpecialButton } from "../buttons";
import { Chat, Link } from "@carbon/icons-react";
import styled from "@emotion/styled";
import { updateSeeTotalScore } from "app/redux/slices/misc";
import { resetMisc } from "app/redux/slices/misc";
import { StopWatch } from "components/StopWatch";

library.add(faRightFromBracket);

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0 4px",
  },
}));

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

const FlashPannel = () => {
  const { flash } = useSelector((state) => state);
  return (
    <div className="flash_multiColumn">
      <div className="flash_columnCell">
        <div className="flash_columnCellTitle">Temps</div>
        <div className="flash_columnCellValue">00:12:45</div>
        <StopWatch />
      </div>

      <div className="flash_columnCell">
        <div className="flash_columnCellTitle">Score</div>
        <div className="flash_columnCellValue">{flash.actualScore}</div>
      </div>

      <div className="flash_columnCell">
        <div className="flash_columnCellTitle">Réussite</div>
        <div className="flash_columnCellValue">60%</div>
      </div>
    </div>
  );
};

const LoginPannel = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  function goToFlash() {
    navigate("/flash");
  }

  return (
    <div className="multiColumn">
      <Button onClick={goToFlash}>Mode flash</Button>
    </div>
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
  const [openCopyLink, setOpenCopyLink] = useState(true);
  const [copyLinkText, setCopyLinkText] = useState(
    "Partager le lien de la partie à vos amis !"
  );
  const { party, user } = useSelector((state) => state);
  const actualUser = useSelector((state) => state.user);
  const socket = useContext(SocketContext);
  const [unreadMessages, setUnreadMessages] = useState(0);

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
    setCopyLinkText("Lien copié dans le presse-papier !");
    setTimeout(() => {
      setCopyLinkText("Partager le lien de la partie à vos amis !");
    }, 3000);
  };

  const handleCloseCopyLink = () => {
    setOpenCopyLink(false);
  };

  const handleOpenCopyLink = () => {
    setOpenCopyLink(true);
  };

  return (
    <div className="multiColumn">
      <ComponentChat
        openChat={openChat}
        closeChat={() => setOpenChat(false)}
        onClick={() => setOpenChat(true)}
        noButton
        newMessageHandle={() => {
          setUnreadMessages((unreadMessages) => unreadMessages + 1);
        }}
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
            arrow
            open={openCopyLink}
            onClose={handleCloseCopyLink}
            onOpen={handleOpenCopyLink}
            placement="top"
            title={copyLinkText}
            style={{
              marginRight: "10px",
            }}
            componentsProps={{
              tooltip: {
                style: {
                  fontSize: "20px",
                  fontFamily: "Raleway Light",
                },
              },
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
          <StyledBadge badgeContent={unreadMessages} color="primary">
            <SpecialButton
              icon
              variant="green"
              value={<Chat width={24} height={24} />}
              onClick={() => {
                setUnreadMessages(0);
                setOpenChat(true);
              }}
              style={{
                marginLeft: "10px",
                borderRadius: "15px",
              }}
            />
          </StyledBadge>
        </div>
      </div>
    </div>
  );
};

const GamePannel = () => {
  const [openChat, setOpenChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { party } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  if (lod_.isEmpty(party)) return null;

  return (
    <div className="multiColumn">
      <ComponentChat
        openChat={openChat}
        closeChat={() => setOpenChat(false)}
        onClick={() => setOpenChat(true)}
        noButton
        newMessageHandle={() => {
          setUnreadMessages((unreadMessages) => unreadMessages + 1);
        }}
      />
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

        <div className="waitingButtonsContainer">
          <PrimaryButton
            value="Stop"
            style={{
              flex: 1,
              fontSize: "20px",
              borderRadius: "15px",
            }}
            onClick={() => {
              socket.emit("stopGame", {
                uuid: party.uuid,
              });
            }}
          />
          <StyledBadge badgeContent={unreadMessages} color="primary">
            <SpecialButton
              icon
              variant="green"
              value={<Chat width={24} height={24} />}
              onClick={() => {
                setUnreadMessages(0);
                setOpenChat(true);
              }}
              style={{
                marginLeft: "10px",
                borderRadius: "15px",
              }}
            />
          </StyledBadge>
        </div>
      </div>
    </div>
  );
};

const ResultsPannel = () => {
  const [openChat, setOpenChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { party, user } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  if (lod_.isEmpty(party)) return null;

  return (
    <div className="multiColumn">
      <ComponentChat
        openChat={openChat}
        closeChat={() => setOpenChat(false)}
        onClick={() => setOpenChat(true)}
        noButton
        newMessageHandle={() => {
          setUnreadMessages((unreadMessages) => unreadMessages + 1);
        }}
      />
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

        <div className="waitingButtonsContainer">
          <PrimaryButton
            value="Suivant"
            style={{
              flex: 1,
              fontSize: "20px",
              borderRadius: "15px",
            }}
            onClick={() => {
              socket.emit("nextRound", {
                partyUUID: party.uuid,
                uuid: user.uuid,
              });
            }}
          />
          <StyledBadge badgeContent={unreadMessages} color="primary">
            <SpecialButton
              icon
              variant="green"
              value={<Chat width={24} height={24} />}
              onClick={() => {
                setUnreadMessages(0);
                setOpenChat(true);
              }}
              style={{
                marginLeft: "10px",
                borderRadius: "15px",
              }}
            />
          </StyledBadge>
        </div>
      </div>
    </div>
  );
};

const ScoreboardPannel = () => {
  const [openChat, setOpenChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { party, user } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  if (lod_.isEmpty(party)) return null;

  return (
    <div className="multiColumn">
      <ComponentChat
        openChat={openChat}
        closeChat={() => setOpenChat(false)}
        onClick={() => setOpenChat(true)}
        noButton
        newMessageHandle={() => {
          setUnreadMessages((unreadMessages) => unreadMessages + 1);
        }}
      />
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

        <div className="waitingButtonsContainer">
          <PrimaryButton
            value="Continuer"
            style={{
              flex: 1,
              fontSize: "20px",
              borderRadius: "15px",
            }}
            onClick={() => {
              dispatch(updateSeeTotalScore(false));
            }}
          />
          <StyledBadge badgeContent={unreadMessages} color="primary">
            <SpecialButton
              icon
              variant="green"
              value={<Chat width={24} height={24} />}
              onClick={() => {
                setUnreadMessages(0);
                setOpenChat(true);
              }}
              style={{
                marginLeft: "10px",
                borderRadius: "15px",
              }}
            />
          </StyledBadge>
        </div>
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
      case "/login":
        return <LoginPannel />;
      case "/lobby":
        return <LobbyPannel />;
      case "/waiting":
        return <WaitingPannel />;
      case "/game":
        return <GamePannel />;
      case "/results":
        return <ResultsPannel />;
      case "/scoreboard":
        return <ScoreboardPannel />;
      case "/flash":
        return <FlashPannel />;
      default:
        return null;
    }
  }

  function bottomPannel() {
    switch (pathname) {
      case "/waiting":
      case "/game":
      case "/results":
      case "/scoreboard":
        return `${party?.users?.length} Joueurs`;
      case "/flash":
        return "";
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
                dispatch(resetMisc());
                socket.emit("disconnected", { uuid: ws.uuid });
                navigate("/");
              }}
            >
              <FontAwesomeIcon icon="right-from-bracket" />
            </IconButton>
          </Tooltip>
        );
      case "/flash":
        return null;
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
          zIndex: "1",
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
          zIndex: "1",
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
