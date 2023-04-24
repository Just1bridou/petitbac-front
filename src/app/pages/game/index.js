import "./style.scss";
import { useContext, useState } from "react";
import { SocketContext } from "app/context/ws";
import { useSelector } from "react-redux";
import { Layout } from "components/layout";
import Header from "components/header";
import { PrimaryInput } from "components/buttons";
import { Chat } from "components/chat";

const LetterContainer = ({ letter }) => {
  return (
    <div className="letterContainer">
      <div className="letter">{letter}</div>
    </div>
  );
};

const TimerContainer = ({ actualTime, time }) => {
  return (
    <div className="timerContainer">
      <div
        className="timerBar"
        style={{
          height: (actualTime / time) * 100 + "%",
        }}
      ></div>
      <div className="timer">{actualTime}</div>
    </div>
  );
};

export const Game = () => {
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
        title={`Manche ${party.currentRound}/${party.rounds}`}
        attributes={
          <div className="gameAttributesContainer">
            <LetterContainer letter={party.currentLetter} />
            {party.time && (
              <TimerContainer actualTime={party.actualTime} time={party.time} />
            )}
          </div>
        }
      ></Header>

      <div className="gameContent">
        <div className="gameContainer">
          {party.words?.map((word, index) => {
            return (
              <div className="wordCell" key={index}>
                <div className="wordCellCategorie">{word}</div>
                <PrimaryInput
                  onChange={(e) => {
                    setInputWord({
                      ...inputWord,
                      [index]: e.target.value,
                    });
                  }}
                  type="text"
                  placeholder={`${party.currentLetter.toUpperCase()} ...`}
                  style={{
                    width: "100%",
                    // color: "#666666",
                    padding: "20px 30px",
                    textTransform: "uppercase",
                    fontStyle: "normal",
                  }}
                  disabled={disabled}
                  spellCheck={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
