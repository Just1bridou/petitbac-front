import { useContext } from "react";
import { SocketContext } from "app/context/ws";
import { useDispatch, useSelector } from "react-redux";
import { createParty } from "app/redux/slices/party";
import { Layout } from "components/layout";
import { PrimaryButton } from "components/buttons";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import Flag from "react-world-flags";
import { login } from "app/redux/slices/user";
import { useNavigate } from "react-router-dom";
import svgNoParties from "app/assets/illustrations/SVG_empty.svg";

const PartyCell = ({ party, onClick }) => {
  return (
    <div className="partyContainer" onClick={onClick}>
      <div className="partySubContainer">
        <div className="partyTitleContainer">
          <h4 className="partyTitle">{`#${party.uuid}`}</h4>
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

      <div className="partySubContainer">
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
            <span className="partyUserCount">{party.users.length}</span>
            <FontAwesomeIcon className="partyUserCountIcon" icon={faUser} />
          </div>
        </Tooltip>
        <Flag
          code={party.language}
          style={{
            height: "10vh",
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
            opacity: "0.8",
          }}
        />
      </div>
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
      style={{ margin: "20px" }}
    >
      <div className="headerCustom">
        <h1>Partie publique</h1>
        <span className="partiesCount">{`(${
          server?.parties?.length ?? 0
        })`}</span>
      </div>

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
        <div className="noPartyContainer">
          <img
            alt="illustration"
            src={svgNoParties}
            style={{
              width: "40%",
            }}
          ></img>
          <div className="textNoParty">
            Il n'y a actuellement aucune partie publique
          </div>
        </div>
      )}

      <div className="createPrivateRoom">
        <PrimaryButton
          value="Créer une partie privée"
          style={{
            width: "100%",
            height: "8vh",
            fontSize: "20px",
          }}
          onClick={createPrivateParty}
        />
      </div>
    </Layout>
  );
};
