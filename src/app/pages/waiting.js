import "./waiting.css";
import { useContext, useRef, useState } from "react";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { createParty } from "../redux/slices/party";
import { Layout } from "../../components/layout";
import Header from "../../components/header";
import { PrimaryInput, SpecialButton } from "../../components/buttons";
import { Title } from "../../components/titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { SwitchCard } from "../../components/switchCard";
import { MultipleSwitch } from "../../components/multipleSwitch";
import { SwitchTimer } from "../../components/switchTimer";
import { RoundsInput } from "../../components/roundsInput";
import { FlagsCard } from "../../components/flagsCard";
import { Chat, ChatButton } from "../../components/chat";
import { IconButton } from "@mui/material";

const ActionIconButton = ({ icon, onClick }) => {
  return (
    <div className="actionIconButton" onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

export const Waiting = () => {
  const { party, user } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  const [inputWord, setInputWord] = useState("");
  const [openChat, setOpenChat] = useState(false);

  const copyActualUrlToClipboard = () => {
    const url = window.location.origin + "/r/" + party.uuid;
    navigator.clipboard.writeText(url);
  };

  function addNewWord() {
    if (!inputWord.trim()) return;
    if (!user.admin) return;
    socket.emit("addPartyWord", {
      uuid: party.uuid,
      newWord: inputWord,
    });
    setInputWord("");
  }

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
      {/* <ChatButton
        onClick={() => setOpenChat(true)}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
        }}
      /> */}
      <Header
        title="Partie privée"
        attributes={
          <SpecialButton
            value="Copier le lien d'invitation"
            style={{
              width: "100%",
              fontSize: "20px",
            }}
            onClick={copyActualUrlToClipboard}
          />
        }
      ></Header>

      <div className="waitingContainer">
        <div className="themesList">
          <Title title="Liste des thèmes" size="medium" />
          <>
            {party?.mode === "classic" ? (
              <div className="themesEditor">
                <div className="themesDisplay">
                  {party?.words?.map((word, index) => {
                    return (
                      <div key={index} className="themeLine">
                        <div className="theme">{word}</div>
                        {party?.words?.length > 1 && (
                          <ActionIconButton
                            icon={faClose}
                            onClick={() => {
                              addNewWord();
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {user.admin && (
                  <div className="themeLine" style={{ margin: 0 }}>
                    <PrimaryInput
                      value={inputWord}
                      onChange={(e) => {
                        setInputWord(e.target.value);
                      }}
                      type="text"
                      placeholder="Ajouter un theme ..."
                      style={{
                        fontSize: "20px",
                        width: "100%",
                        backgroundColor: "#d9d9d9",
                        marginRight: "5px",
                      }}
                      onEnterPress={() => {
                        addNewWord();
                      }}
                    />
                    <ActionIconButton
                      icon={faPaperPlane}
                      onClick={() => {
                        if (!inputWord.trim()) return;
                        if (!user.admin) return;
                        socket.emit("addPartyWord", {
                          uuid: party.uuid,
                          newWord: inputWord,
                        });
                        setInputWord("");
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="displayMode">Mode de jeu aléatoire</div>
            )}
          </>
        </div>
        <div className="optionList">
          <Title title="Mode de jeu" size="medium" />
          <MultipleSwitch
            items={[
              {
                code: "classic",
                title: "Classique",
                description:
                  "Définissez vos propres thèmes ou charger ceux de la communauté",
              },
              {
                code: "random",
                title: "Aléatoire",
                description:
                  "Les thèmes restent inconnus jusqu’a la première manche",
              },
            ]}
            selected={party?.mode}
            onClick={(mode) => {
              if (!user.admin) return;
              socket.emit("changePartyMode", {
                uuid: party.uuid,
                mode,
              });
            }}
          />
          <Title title="Paramètres" size="medium" />
          <SwitchTimer
            title="Timer"
            items={["30", "60", "90"]}
            value={party?.time}
            setValue={(time) => {
              if (!user.admin) return;
              socket.emit("changePartyTime", {
                uuid: party.uuid,
                time,
              });
            }}
          />
          <RoundsInput
            title="Manches"
            value={party?.rounds}
            setValue={(rounds) => {
              if (!user.admin) return;
              socket.emit("changePartyRounds", {
                uuid: party.uuid,
                rounds,
              });
            }}
          />
          <FlagsCard
            title="Langage"
            value={party.language}
            setValue={(flag) => {
              if (!user.admin) return;
              socket.emit("changePartyLanguage", {
                uuid: party.uuid,
                language: flag,
              });
            }}
          />
          <SwitchCard
            title="Partie publique"
            description="Si votre partie est publie, n'importe qui pourra la rejoindre."
            value={party?.visibility === "public"}
            setValue={(isPublic) => {
              if (!user.admin) return;
              socket.emit("changePartyVisibility", {
                uuid: party.uuid,
                isPublic,
              });
            }}
          />
        </div>
      </div>
    </Layout>
  );
};
