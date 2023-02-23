import "./results.css";
import { useContext, useState } from "react";
import { SocketContext } from "../context/ws";
import { useSelector } from "react-redux";
import { Layout } from "../../components/layout";
import Header from "../../components/header";
import { Chat } from "../../components/chat";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

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
              <h4 className="categorieTitle">{word}</h4>
              <div className="table">
                <div className="lineContent tableHeader">
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
                  <div
                    className="lineContentHeader"
                    style={{
                      textAlign: "right",
                    }}
                  >
                    Actions
                  </div>
                </div>
                {party.answers.map((answer, i) => {
                  let userRow = party.users.find((u) => u.uuid === answer.uuid);
                  let actualAnswer = answer.words[index];

                  if (!userRow) return null;

                  let voteLessThanFifty =
                    actualAnswer.votes.filter((v) => v.vote).length <
                    party.users.length / 2;

                  return (
                    <div
                      className="lineContent tableBody"
                      key={i}
                      style={{
                        textDecoration: voteLessThanFifty ? "line-through" : "",
                        textDecorationColor: voteLessThanFifty ? "red" : "",
                        textDecorationThickness: voteLessThanFifty ? "4px" : "",
                      }}
                    >
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
                      <div
                        className="lineContentCell"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {actualAnswer.word && (
                          <a
                            href={`https://fr.wikipedia.org/wiki/${actualAnswer.word}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textDecoration: "none",
                              color: "black",
                            }}
                          >
                            <Tooltip
                              placement="top"
                              title={`Voir si "${actualAnswer.word}" existe`}
                            >
                              <FontAwesomeIcon icon={faBook} />
                            </Tooltip>
                          </a>
                        )}
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
