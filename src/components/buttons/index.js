import "./buttons.scss";
import useSound from "use-sound";
import pop from "../../app/assets/sounds/pop.mp3";

export const PrimaryInput = ({
  placeholder,
  value,
  onChange,
  onKeyPress,
  onEnterPress,
  ...rest
}) => {
  return (
    <input
      onKeyDown={(event) => {
        if (onEnterPress && event.key === "Enter") {
          onEnterPress();
        } else {
          if (onKeyPress) {
            onKeyPress(event);
          }
        }
      }}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="input primary-input"
      {...rest}
    ></input>
  );
};

export const PrimaryButton = ({ value, onClick, ...rest }) => {
  const [play] = useSound(pop);

  function handleClick() {
    play();
    onClick();
  }

  return (
    <button onClick={handleClick} className="button primary-button" {...rest}>
      {value}
    </button>
  );
};

export const SpecialButton = ({ value, onClick, variant, icon, ...rest }) => {
  const [play] = useSound(pop);

  function handleClick() {
    play();
    onClick();
  }

  let variantClass = "";

  switch (variant) {
    case "pink":
      variantClass = "button-pink";
      break;
    case "green":
      variantClass = "button-green";
      break;
    default:
      break;
  }
  if (icon) {
    variantClass += " button-icon";
  }

  return (
    <button
      onClick={handleClick}
      className={`${variantClass} button special-button`}
      {...rest}
    >
      {value}
    </button>
  );
};
