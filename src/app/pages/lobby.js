import { useContext, useRef } from "react";
import { AccessContent } from "./AccessContent";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { createParty } from "../redux/slices/party";
import { Layout } from "../../components/layout";
import Header from "../../components/header";
import { PrimaryButton, PrimaryInput } from "../../components/buttons";
import "./lobby.css";

export const Lobby = () => {
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const { server } = useSelector((state) => state);
  const dispatch = useDispatch();

  const createPrivateParty = () => {
    socket.emit("createPrivateParty", { uuid: uuid }, ({ party }) => {
      dispatch(createParty({ party: party }));
    });
  };

  return (
    <AccessContent>
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
        {server.parties.length ? (
          <>Parties : {server.parties.length}</>
        ) : (
          <div>Il n'y a actuellement aucunes parties publiques</div>
        )}
      </Layout>
    </AccessContent>
  );
};
