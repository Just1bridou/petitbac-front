import { useContext, useRef } from "react";
import { AccessContent } from "./AccessContent";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { createParty } from "../redux/slices/party";
import { Layout } from "../../components/layout";
import Header from "../../components/header";
import { SpecialButton } from "../../components/buttons";

export const Waiting = () => {
  const inputRef = useRef(null);
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const { party } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <AccessContent>
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
              onClick={() => {}}
            />
          }
        ></Header>
      </Layout>
    </AccessContent>
  );
};
