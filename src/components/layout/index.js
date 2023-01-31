import { Pannel } from "../pannel";
import "./style.css";
export const Layout = ({
  children,
  verticalAlign,
  horizontalAlign,
  style,
  ...rest
}) => {
  return (
    <div className="layout">
      <div
        style={{
          ...style,
          flex: "3",
          // height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: verticalAlign ?? "center",
          alignItems: horizontalAlign ?? "center",
        }}
        {...rest}
      >
        {children}
      </div>
      <Pannel />
    </div>
  );
};
