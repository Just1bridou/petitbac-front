import "./style.scss";
import Flag from "react-world-flags";

export const FlagsCard = ({ title, value, setValue }) => {
  const flags = ["FR", "UK", "DE", "ES", "IT"];
  return (
    <div className="flagsCard">
      <div className="flagsCardHeader">
        <div className="flagsCardTitle">{title}</div>
        <div className="flagsCardDescription">
          {flags.map((flag, index) => {
            return (
              <div className="flagContainer" key={index}>
                <Flag
                  className="flag"
                  key={index}
                  code={flag}
                  style={{
                    height: "1.5em",
                    marginRight: "1vw",
                    borderRadius: "3px",
                    filter: value === flag ? "brightness(0.5)" : "none",
                  }}
                  onClick={() => {
                    setValue(flag);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
