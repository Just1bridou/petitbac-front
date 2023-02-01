import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/user";
import { PrimaryButton, PrimaryInput } from "../../components/buttons/index";
import logo from "../assets/images/logo.png";
import { Layout } from "../../components/layout";
import { createParty } from "../redux/slices/party";

export const JoinPage = () => {
  let { id } = useParams();
  const [pseudo, setPseudo] = useState("");
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Layout>
      <div
        style={{
          height: "60vh",
          width: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <img
          style={{
            height: "20vh",
            width: "auto",
            contentFit: "contain",
          }}
          src={logo}
          alt="logo"
        ></img>
        <div
          style={{
            width: "100%",
          }}
        >
          <PrimaryInput
            onChange={(e) => {
              setPseudo(e.target.value);
            }}
            type="text"
            placeholder="Pseudo ..."
            style={{
              width: "100%",
            }}
          />
          <PrimaryButton
            value="REJOINDRE"
            onClick={() => {
              if (!!pseudo) {
                socket.emit(
                  "joinRoom",
                  {
                    uuid: uuid,
                    pseudo: pseudo,
                    roomUUID: id,
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
              }
            }}
            style={{
              marginTop: "1rem",
              width: "100%",
            }}
          />
        </div>
      </div>
    </Layout>
  );
};
