import "./style.css";
import { Switch } from "@mui/material";

export const SwitchTimer = ({ title, items, value, setValue }) => {
  function handleChangeSwitch(e) {
    setValue(!value);
  }
  function handleChangeTimer(timer) {
    setValue(timer);
  }
  return (
    <div className="switchTimer">
      <div className="switchTimerHeader">
        <div className="switchTimerTitle">{title}</div>
        <Switch checked={Boolean(value)} onChange={handleChangeSwitch} />
      </div>

      <div className="switchTimerBody">
        <div className="switchTimerDescription">
          {items.map((item, index) => {
            return (
              <div
                key={index}
                className="switchTimerItem"
                style={{
                  backgroundColor: value === item ? "#EEC643" : "",
                  color: value === item ? "#011638" : "",
                }}
                onClick={() => {
                  handleChangeTimer(item);
                }}
              >
                {`${item}s`}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
