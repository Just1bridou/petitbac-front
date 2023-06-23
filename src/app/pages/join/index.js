import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { SocketContext } from "app/context/ws";
import { useDispatch, useSelector } from "react-redux";
import { login } from "app/redux/slices/user";
import { PrimaryButton, PrimaryInput } from "components/buttons/index";
import logo from "app/assets/images/logo.png";
import { Layout } from "components/layout";
import { createParty } from "app/redux/slices/party";
import svgLogin from "app/assets/illustrations/SVG_login.svg";
import { MainDialog } from "components/MainDialog";

export const JoinPage = () => {
  let { id } = useParams();
  const [pseudo, setPseudo] = useState("");
  const socket = useContext(SocketContext);
  const uuid = useSelector((state) => state.ws.uuid);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const joinUser = () => {
    if (!!pseudo) {
      socket.timeout(5000).emit(
        "joinRoom",
        {
          uuid: uuid,
          pseudo: pseudo,
          roomUUID: id,
        },
        (err, response) => {
          if (err) {
            console.log(`socket error: joinRoom: ${err}`);
            return;
          }

          if (!response.error) {
            dispatch(login({ user: response.user }));
            dispatch(createParty({ party: response.party }));
            socket.timeout(5000).emit("saveUser", { uuid: uuid }, (err, _) => {
              if (err) {
                console.log(`socket error: saveUser: ${err}`);
              }
            });
            navigate("/waiting");
          }
        }
      );
    }
  };

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
        <MainDialog />
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
            onEnterPress={joinUser}
          />
          <PrimaryButton
            value="Rejoindre"
            onClick={joinUser}
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
