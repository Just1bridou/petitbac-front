import "./waiting.scss";
import { useContext, useState } from "react";
import { SocketContext } from "../context/ws";
import { useSelector } from "react-redux";
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
import { Send, Close } from "@carbon/icons-react";

const ActionIconButton = ({ icon, onClick }) => {
  return (
    <div className="actionIconButton" onClick={onClick}>
      {/* <FontAwesomeIcon className="actionIconButtonIcon" icon={icon} /> */}
      <Close className="actionIconButtonIcon" />
    </div>
  );
};

export const Waiting = () => {
  const { party, user } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  const [inputWord, setInputWord] = useState("");

  function addNewWord() {
    if (!inputWord.trim()) return;
    if (!user.admin) return;
    socket.emit("addPartyWord", {
      uuid: party.uuid,
      newWord: inputWord,
    });
    setInputWord("");
  }

  function removePartyWord(word) {
    if (!user.admin) return;
    socket.emit("removePartyWord", {
      uuid: party.uuid,
      word: word,
    });
  }

  return (
    <Layout
      horizontalAlign="start"
      verticalAlign="flex-end"
      style={{
        margin: "10px 20px",
      }}
    >
      <div className="waitingContainer">
        <div className="themesList">
          <Title title="Liste des thèmes" size="medium" />
          <>
            {party?.mode === "classic" ? (
              <div className="themesEditor">
                {party?.words?.map((word, index) => {
                  return (
                    <div key={index} className="themeLine">
                      <div className="theme">{word}</div>
                      {party?.words?.length > 1 && (
                        <ActionIconButton
                          icon={faClose}
                          onClick={() => {
                            removePartyWord(word);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="displayMode">Mode de jeu aléatoire</div>
            )}
          </>

          {party?.mode === "classic" && user.admin && (
            <div className="inputAddWordContainer">
              <PrimaryInput
                value={inputWord}
                onChange={(e) => {
                  setInputWord(e.target.value);
                }}
                type="text"
                placeholder="Ajouter un theme ..."
                // style={{
                //   fontSize: "20px",
                //   width: "100%",
                //   backgroundColor: "#d9d9d9",
                //   marginRight: "5px",
                // }}
                style={{
                  flex: 1,
                  borderRadius: "15px",
                  marginRight: "5px",
                  fontSize: "20px",
                  height: "7vh",
                }}
                onEnterPress={() => {
                  addNewWord();
                }}
              />

              <SpecialButton
                icon
                variant="pink"
                value={
                  <Send width={24} height={24} />
                  // <FontAwesomeIcon width={24} height={24} icon={faPaperPlane} />
                }
                onClick={addNewWord}
                style={{
                  borderRadius: "15px",
                  width: "7vh",
                  height: "7vh",
                }}
              />
            </div>
          )}
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
          <Title
            title="Paramètres"
            size="medium"
            style={{
              marginTop: "2vh",
            }}
          />
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
