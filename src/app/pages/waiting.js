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

  const copyActualUrlToClipboard = () => {
    const url = window.location.origin + "/r/" + party.uuid;
    navigator.clipboard.writeText(url);
  };

  return (
    <Layout
      horizontalAlign="start"
      verticalAlign="start"
      style={{
        margin: "10px 20px",
      }}
    >
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
          <div className="themesEditor">
            <div className="themesDisplay">
              {party?.words?.map((word, index) => {
                return (
                  <div key={index} className="themeLine">
                    <div className="theme">{word}</div>
                    <ActionIconButton icon={faClose} />
                  </div>
                );
              })}
            </div>
            <div className="themeLine" style={{ margin: 0 }}>
              <PrimaryInput
                onChange={(e) => {}}
                type="text"
                placeholder="Ajouter un theme ..."
                style={{
                  fontSize: "20px",
                  width: "100%",
                  backgroundColor: "#d9d9d9",
                  marginRight: "5px",
                }}
              />
              <ActionIconButton icon={faPaperPlane} />
            </div>
          </div>
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
          />
          <Title title="Paramètres" size="medium" />
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
