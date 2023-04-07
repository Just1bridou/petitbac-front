import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Drawer,
  IconButton,
  List,
  ListItem,
  Tooltip,
} from "@mui/material";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryInput, SpecialButton } from "../buttons";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../app/context/ws";
import { refreshPartyChat } from "../../app/redux/slices/party";
import styled from "@emotion/styled";
import {
  Send,
  VolumeUpFilled,
  VolumeMuteFilled,
  Translate,
} from "@carbon/icons-react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0 4px",
  },
}));

export const Chat = ({
  openChat,
  closeChat,
  onClick,
  noButton,
  newMessageHandle,
  ...rest
}) => {
  const EASTER_EGG_TRIGGER = 12;
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [easterEggVoc, setEasterEggVoc] = useState(0);
  const { party, user } = useSelector((state) => state);
  const [message, setMessage] = useState("");
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  let chatFeed = party?.chat ?? [];

  socket.removeListener("newChatMessage");
  socket.on("newChatMessage", (data) => {
    let newMsg = data.chat[data.chat.length - 1];
    let str = `${newMsg.user} à dit : ${newMsg.message}`;
    !isMuted && newMsg.user !== user.pseudo && read(str);
    dispatch(refreshPartyChat(data));
    if (!openChat) {
      newMessageHandle && newMessageHandle(newMsg);
      setUnreadMessages(unreadMessages + 1);
    }
  });

  function sendMessage() {
    socket.emit("newChatMessage", {
      partyUUID: party.uuid,
      userUUID: user.uuid,
      message,
    });
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [party.chat, openChat]);

  setTimeout(() => {
    scrollToBottom();
  }, 100);

  function read(msg) {
    var reader = new SpeechSynthesisUtterance();
    // easter egg
    if (easterEggVoc > EASTER_EGG_TRIGGER) {
      var voices = window.speechSynthesis.getVoices();
      reader.voice = voices[Math.floor(Math.random() * voices.length)];
    }
    // end
    reader.text = msg;
    window.speechSynthesis.speak(reader);
  }

  return (
    <>
      {/*
       * Button for open chat
       */}
      {!noButton && (
        <Box className="containerOpenChat">
          <IconButton
            className="buttonOpenChat"
            size="small"
            onClick={() => {
              onClick();
              setUnreadMessages(0);
            }}
            {...rest}
          >
            <StyledBadge badgeContent={unreadMessages} color="primary">
              <FontAwesomeIcon icon={faMessage} />
            </StyledBadge>
          </IconButton>
        </Box>
      )}
      {/*
       * Drawer for show chat
       */}
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#011638",
            margin: "20px",
            padding: "10px",
            borderRadius: "25px",
            height: "calc(100% - 40px)",
          },
        }}
        anchor="right"
        open={openChat}
        onClose={closeChat}
      >
        <Box className="chat">
          <List className="chatFeed">
            {chatFeed.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  ref={index === chatFeed.length - 1 ? messagesEndRef : null}
                >
                  <div
                    className={`chatMessage ${
                      item.user === user.pseudo ? "selfMessage" : ""
                    }`}
                  >
                    <div className="chatMessagePseudo">{item.user}</div>
                    <div className="chatMessageMessage">{item.message}</div>
                  </div>
                </ListItem>
              );
            })}
          </List>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Tooltip placement="top" title="Activer / Couper le son du chat">
              <span>
                <SpecialButton
                  icon
                  variant={isMuted ? "pink" : "green"}
                  value={
                    easterEggVoc > EASTER_EGG_TRIGGER ? (
                      <Translate width={24} height={24} />
                    ) : isMuted ? (
                      <VolumeMuteFilled width={24} height={24} />
                    ) : (
                      <VolumeUpFilled width={24} height={24} />
                    )
                  }
                  onClick={() => {
                    setIsMuted(!isMuted);
                    setEasterEggVoc(easterEggVoc + 1);
                  }}
                  style={{
                    marginRight: "10px",
                    borderRadius: "15px",
                  }}
                />
              </span>
            </Tooltip>
            <PrimaryInput
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              type="text"
              placeholder="Message ..."
              style={{
                // height: "6vh",
                width: "70%",
                fontSize: "20px",
                borderRadius: "10px",
              }}
              onEnterPress={() => {
                setMessage("");
                sendMessage();
              }}
            />
            <SpecialButton
              icon
              variant="pink"
              value={<Send width={24} height={24} />}
              onClick={() => {
                setMessage("");
                sendMessage();
              }}
              style={{
                marginLeft: "10px",
                borderRadius: "15px",
              }}
            />
          </div>
        </Box>
      </Drawer>
    </>
  );
};
