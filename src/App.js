import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./app/pages/login";
import { SocketContext, socket } from "./app/context/ws";
import WebSockets from "./app/ws";
import { Lobby } from "./app/pages/lobby";
import { Waiting } from "./app/pages/waiting";
import logo from "./app/assets/images/logo.png";
import { JoinPage } from "./app/pages/join";
import { Game } from "./app/pages/game";
import { Results } from "./app/pages/results";
import { Background } from "./components/Background";
const Home = () => {
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <img
          style={{
            height: "50%",
            width: "auto",
            contentFit: "contain",
          }}
          src={logo}
          alt="logo"
        ></img>
      </div>
    </section>
  );
};

function App() {
  return (
    <Background>
      <BrowserRouter>
        <SocketContext.Provider value={socket}>
          <WebSockets></WebSockets>
          <Routes>
            <Route exact path="*" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/lobby" element={<Lobby />} />
            <Route exact path="/waiting" element={<Waiting />} />
            <Route exact path="/game" element={<Game />} />
            <Route exact path="/results" element={<Results />} />
            <Route exact path="/r/:id" element={<JoinPage />} />
          </Routes>
        </SocketContext.Provider>
      </BrowserRouter>
    </Background>
  );
}

export default App;
