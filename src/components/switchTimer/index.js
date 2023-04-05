import "./style.scss";
import { CustomSwitch } from "../CustomSwitch";

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
        <CustomSwitch checked={Boolean(value)} onChange={handleChangeSwitch} />
      </div>
      {value && (
        <div className="switchTimerBody">
          <div className="switchTimerDescription">
            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    value === item ? "selectedTime" : ""
                  } switchTimerItem`}
                  onClick={() => {
                    handleChangeTimer(item);
                  }}
                >
                  <div>
                    <span className="time">{`${item}`}</span>
                    <span className="second">s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
