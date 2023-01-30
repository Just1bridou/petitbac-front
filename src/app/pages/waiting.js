import { useContext, useRef } from "react";
import { AccessContent } from "./AccessContent";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { createParty } from "../redux/slices/party";

export const Waiting = () => {
  const inputRef = useRef(null);
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const { party } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <AccessContent>
      <div>
        <h1>Le petit bac</h1>
        <h2>{`Partie privée : ${party.uuid}`}</h2>
      </div>
    </AccessContent>
  );
};
