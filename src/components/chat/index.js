import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Drawer, IconButton, List, ListItem } from "@mui/material";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryInput } from "../buttons";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../app/context/ws";
import { refreshPartyChat } from "../../app/redux/slices/party";
import styled from "@emotion/styled";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0 4px",
  },
}));

export const Chat = ({ openChat, closeChat, onClick, noButton, ...rest }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);

  const { party, user } = useSelector((state) => state);
  const [message, setMessage] = useState("");
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  let chatFeed = party?.chat ?? [];

  socket.removeListener("newChatMessage");
  socket.on("newChatMessage", (data) => {
    dispatch(refreshPartyChat(data));
    if (!openChat) {
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
      <Drawer anchor="right" open={openChat} onClose={closeChat}>
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
          <PrimaryInput
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            type="text"
            placeholder="Message ..."
            style={{
              height: "40px",
              fontSize: "20px",
              width: "100%",
              backgroundColor: "#d9d9d9",
              borderRadius: "0px",
            }}
            onEnterPress={() => {
              setMessage("");
              sendMessage();
            }}
          />
        </Box>
      </Drawer>
    </>
  );
};
