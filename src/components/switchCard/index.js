import "./style.scss";
import { CustomSwitch } from "../CustomSwitch";

export const SwitchCard = ({ title, description, value, setValue }) => {
  function handleChange(e) {
    setValue(!value);
  }
  return (
    <div className="switchCard">
      <div className="switchCardHeader">
        <div className="switchCardTitle">{title}</div>
        <CustomSwitch checked={value} onChange={handleChange} />
      </div>

      <div className="switchCardBody">
        <div className="switchCardDescription">{description}</div>
      </div>
    </div>
  );
};
