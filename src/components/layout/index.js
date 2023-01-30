import { Pannel } from "../pannel";
import "./style.css";
export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div
        style={{
          flex: "3",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
      <Pannel />
    </div>
  );
};
