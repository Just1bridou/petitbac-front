import "./style.css";

export const Title = ({ title, size }) => {
  switch (size) {
    case "small":
      return <h3 className="title">{title}</h3>;
    case "medium":
      return <h2 className="title">{title}</h2>;
    case "large":
      return <h1 className="title">{title}</h1>;
    default:
      return null;
  }
};
