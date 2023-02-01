import "./style.css";
import { Switch } from "@mui/material";

export const SwitchCard = ({ title, description, value, setValue }) => {
  function handleChange(e) {
    setValue(!value);
  }
  return (
    <div className="switchCard">
      <div className="switchCardHeader">
        <div className="switchCardTitle">{title}</div>
        <Switch checked={value} onChange={handleChange} />
      </div>

      <div className="switchCardBody">
        <div className="switchCardDescription">{description}</div>
      </div>
    </div>
  );
};
