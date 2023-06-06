import { SpecialButton } from "components/buttons";
import "./style.css";
import { ArrowLeft } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";

const Header = ({ title, backMenu, attributes, ...rest }) => {
  const navigate = useNavigate();

  function backMenuFunction() {
    navigate("/login");
  }

  return (
    <div className="headerContainer" {...rest}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {backMenu && (
          <div>
            <SpecialButton
              variant="pink"
              value={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowLeft />
                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Menu
                  </span>
                </div>
              }
              onClick={() => {
                backMenuFunction();
              }}
              style={{
                fontSize: "20px",
                marginRight: "10px",
              }}
            />
          </div>
        )}
        <h1>{title}</h1>
      </div>
      <div>{attributes}</div>
    </div>
  );
};

export default Header;
