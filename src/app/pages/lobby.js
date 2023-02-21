import { useContext } from "react";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { createParty } from "../redux/slices/party";
import { Layout } from "../../components/layout";
import Header from "../../components/header";
import { PrimaryButton, PrimaryInput } from "../../components/buttons";
import "./lobby.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import Flag from "react-world-flags";
import { login } from "../redux/slices/user";
import { useNavigate } from "react-router-dom";

const PartyCell = ({ party, onClick }) => {
  return (
    <div className="partyContainer" onClick={onClick}>
      <div className="partyHeader">
        <Tooltip placement="top" title={party.uuid}>
          <h4 className="partyTitle">{party.uuid}</h4>
        </Tooltip>
        <Flag
          code={party.language}
          style={{
            height: "1.1em",
            marginRight: "1vw",
            borderRadius: "3px",
          }}
        />
        <Tooltip
          placement="right"
          title={
            <>
              <ul>
                {party.users.map((user, index) => {
                  return <li key={index}>{user.pseudo}</li>;
                })}
              </ul>
            </>
          }
        >
          <div className="partyUsers">
            <FontAwesomeIcon icon={faUser} />
            <span className="partyUserCount">{party.users.length}</span>
          </div>
        </Tooltip>
      </div>
      <Tooltip
        placement="right"
        title={
          <>
            <ul>
              {party.words.map((word, index) => {
                return <li key={index}>{word}</li>;
              })}
            </ul>
          </>
        }
      >
        <div className="partyThemes">{`${party.words.length} Thèmes`}</div>
      </Tooltip>
    </div>
  );
};

export const Lobby = () => {
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const { server, user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createPrivateParty = () => {
    socket.emit("createPrivateParty", { uuid: uuid }, ({ party }) => {
      dispatch(createParty({ party: party }));
    });
  };

  return (
    <Layout
      horizontalAlign="start"
      verticalAlign="start"
      style={{
        margin: "10px 20px",
      }}
    >
      <Header title="Partie privée"></Header>

      <div className="joinPrivateRoom">
        <PrimaryInput
          onChange={(e) => {}}
          type="text"
          placeholder="Code de la partie ..."
          style={{
            width: "100%",
          }}
        />
        <PrimaryButton
          value="REJOINDRE"
          style={{
            marginLeft: "1vw",
          }}
          onClick={() => {}}
        />
      </div>

      <div className="createPrivateRoom">
        <PrimaryButton
          value="CRÉER UNE PARTIE PRIVÉE"
          style={{
            width: "100%",
          }}
          onClick={createPrivateParty}
        />
      </div>

      <Header
        title="Parties publiques"
        style={{
          marginTop: "2vh",
        }}
      ></Header>
      {server?.parties?.length ? (
        <div className="partiesContainer">
          {server.parties.map((party, index) => {
            return (
              <PartyCell
                key={index}
                party={party}
                index={index}
                onClick={() => {
                  socket.emit(
                    "joinRoom",
                    {
                      uuid: uuid,
                      pseudo: user.pseudo,
                      roomUUID: party.uuid,
                    },
                    (ack) => {
                      if (!ack.error) {
                        dispatch(login({ user: ack.user }));
                        dispatch(createParty({ party: ack.party }));
                        socket.emit("saveUser", { uuid: uuid });
                        navigate("/waiting");
                      }
                    }
                  );
                }}
              />
            );
          })}
        </div>
      ) : (
        <div>Il n'y a actuellement aucunes parties publiques</div>
      )}
    </Layout>
  );
};
