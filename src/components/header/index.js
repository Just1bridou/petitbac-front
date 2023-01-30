import "./style.css";

const Header = ({ title, attributes, ...rest }) => {
  return (
    <div className="headerContainer" {...rest}>
      <h1>{title}</h1>
      <div>{attributes}</div>
    </div>
  );
};

export default Header;
