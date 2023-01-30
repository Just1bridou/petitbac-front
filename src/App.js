import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./app/pages/login";
import { SocketContext, socket } from "./app/context/ws";
import WebSockets from "./app/ws";
import { AccessContent } from "./app/pages/AccessContent";
import { Lobby } from "./app/pages/lobby";
import { Waiting } from "./app/pages/waiting";
import logo from "./app/images/logo.png";
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
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        <WebSockets></WebSockets>
        <Routes>
          <Route exact path="*" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/lobby" element={<Lobby />} />
          <Route exact path="/waiting" element={<Waiting />} />
        </Routes>
      </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;
