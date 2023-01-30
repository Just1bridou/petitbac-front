import "./buttons.css";

export const PrimaryInput = ({ placeholder, value, onChange, ...rest }) => {
  return (
    <input
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="input primary-input"
      {...rest}
    ></input>
  );
};

export const PrimaryButton = ({ value, onClick, ...rest }) => {
  return (
    <button onClick={onClick} className="button primary-button" {...rest}>
      {value}
    </button>
  );
};
