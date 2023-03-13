import { useContext, useState } from "react";
import { SocketContext } from "../context/ws";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/user";
import { PrimaryButton, PrimaryInput } from "../../components/buttons/index";
import logo from "../assets/images/logo.png";
import { Layout } from "../../components/layout";
import svgLogin from "../assets/illustrations/SVG_login.svg";

export const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const dispatch = useDispatch();

  function loginUser() {
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
  }

  return (
    <Layout verticalAlign="unset" /*horizontalAlign="unset"*/>
      <div
        style={{
          width: "60%",
          margin: "20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <img
          style={{
            height: "25vh",
            width: "auto",
            contentFit: "contain",
          }}
          src={logo}
          alt="logo"
        ></img>
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <img
            alt="illustration"
            src={svgLogin}
            style={{
              width: "80%",
            }}
          ></img>
          <PrimaryInput
            onChange={(e) => {
              setPseudo(e.target.value);
            }}
            type="text"
            placeholder="Pseudo ..."
            style={{
              width: "100%",
              padding: "2% 3%",
            }}
            onEnterPress={loginUser}
          />
          <PrimaryButton
            value="Jouer"
            onClick={loginUser}
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "2% 3%",
            }}
          />
        </div>
      </div>
    </Layout>
  );
};
