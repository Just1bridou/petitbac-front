import "./results.css";
import { useContext, useState } from "react";
import { SocketContext } from "../context/ws";
import { useSelector } from "react-redux";
import { Layout } from "../../components/layout";
import Header from "../../components/header";
import { Chat } from "../../components/chat";
import { Tooltip } from "@mui/material";

const LetterContainer = ({ letter }) => {
  return (
    <div className="letterContainer">
      <div className="letter">{letter}</div>
    </div>
  );
};

const VoteBlock = ({ vote, onClick, style, title, ...rest }) => {
  return (
    <Tooltip
      placement="top"
      title={title ?? ""}
      style={{
        display: title ? "block" : "none",
      }}
    >
      <div
        onClick={onClick}
        className="vote"
        style={{
          ...style,
          backgroundColor: vote ? "#37dc37" : "#ff5c5c",
        }}
        {...rest}
      ></div>
    </Tooltip>
  );
};

export const Results = () => {
  const { party, user } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  const [openChat, setOpenChat] = useState(false);

  const [inputWord, setInputWord] = useState([]);

  const [disabled, setDisabled] = useState(false);

  /**
   * When party stop
   */
  socket.removeListener("stopGame");
  socket.on("stopGame", () => {
    setDisabled(true);
    socket.emit("savePartyWords", {
      uuid: user.uuid,
      partyUUID: party.uuid,
      words: inputWord,
    });
  });

  return (
    <Layout
      horizontalAlign="start"
      verticalAlign="start"
      style={{
        margin: "10px 20px",
      }}
    >
      <Chat
        openChat={openChat}
        closeChat={() => setOpenChat(false)}
        onClick={() => setOpenChat(true)}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
        }}
      />
      <Header
        title={`Résultats manche ${party.currentRound}`}
        attributes={
          <div className="gameAttributesContainer">
            <LetterContainer letter={party.currentLetter} />
          </div>
        }
      ></Header>

      <div className="gameContent">
        {party.words?.map((word, index) => {
          return (
            <div key={index}>
              <h4>{word}</h4>
              <div className="table">
                <div className="lineContent">
                  <div className="lineContentHeader">Joueur</div>
                  <div className="lineContentHeader">Mot</div>
                  <div className="lineContentHeader">Vote</div>
                  <div
                    className="lineContentHeader"
                    style={{
                      textAlign: "right",
                    }}
                  >
                    Réponses
                  </div>
                </div>
                {party.answers.map((answer, i) => {
                  let userRow = party.users.find((u) => u.uuid === answer.uuid);
                  let actualAnswer = answer.words[index];

                  if (!userRow) return null;
                  return (
                    <div className="lineContent" key={i}>
                      <div className="lineContentCell">{userRow?.pseudo}</div>
                      <div className="lineContentCell">{actualAnswer.word}</div>
                      <div className="lineContentCell">
                        <VoteBlock
                          style={{
                            cursor: "pointer",
                          }}
                          vote={
                            actualAnswer.votes.find((v) => v.uuid === user.uuid)
                              ?.vote
                          }
                          onClick={() => {
                            socket.emit("changeVote", {
                              uuid: user.uuid,
                              answerUUID: answer.uuid,
                              partyUUID: party.uuid,
                              wordIndex: index,
                              vote: !actualAnswer.votes.find(
                                (v) => v.uuid === user.uuid
                              )?.vote,
                            });
                          }}
                        />
                      </div>
                      <div
                        className="lineContentCell"
                        style={{
                          flexDirection: "row-reverse",
                        }}
                      >
                        {actualAnswer.votes.map((vote, voteIndex) => {
                          return (
                            <VoteBlock
                              key={voteIndex}
                              vote={vote.vote}
                              title={
                                party.users.find((u) => u.uuid === vote.uuid)
                                  .pseudo
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};
