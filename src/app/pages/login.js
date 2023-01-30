import { useContext, useState } from "react";
import { AccessContent } from "./AccessContent";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/user";
import { PrimaryButton, PrimaryInput } from "../../components/buttons/index";
import logo from "../assets/images/logo.png";
import { Layout } from "../../components/layout";

export const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const dispatch = useDispatch();
  return (
    <AccessContent>
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
              value="JOUER"
              onClick={() => {
                if (!!pseudo) {
                  socket.emit(
                    "login",
                    {
                      uuid: uuid,
                      pseudo: pseudo,
                    },
                    ({ user }) => {
                      dispatch(login({ user: user }));
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
    </AccessContent>
  );
};
