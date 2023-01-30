import { useContext, useRef } from "react";
import { AccessContent } from "./AccessContent";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { createParty } from "../redux/slices/party";
import { Layout } from "../../components/layout";

export const Lobby = () => {
  const inputRef = useRef(null);
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const dispatch = useDispatch();

  const createPrivateParty = () => {
    socket.emit("createPrivateParty", { uuid: uuid }, ({ party }) => {
      dispatch(createParty({ party: party }));
    });
  };

  return (
    <AccessContent>
      <Layout>
        <h1>Le petit bac</h1>
        <h2>Lobby</h2>
        <input ref={inputRef} type="text" placeholder="Code partie" />
        <button>rejoindre</button>
        <button onClick={createPrivateParty}>Créer une partie</button>
        <h2>Parties publiques</h2>
      </Layout>
    </AccessContent>
  );
};
