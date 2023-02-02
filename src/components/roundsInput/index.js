import "./style.css";
import { Switch } from "@mui/material";

export const RoundsInput = ({ title, value, setValue }) => {
  return (
    <div className="roundsInput">
      <div className="roundsInputHeader">
        <div className="roundsInputTitle">{title}</div>
        <input
          value={value}
          type="number"
          max="10"
          min="1"
          className="roundsInputItem"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        ></input>
      </div>
    </div>
  );
};
