import "./style.scss";

export const Title = ({ title, size, ...rest }) => {
  switch (size) {
    case "small":
      return (
        <h3 className="title" {...rest}>
          {title}
        </h3>
      );
    case "medium":
      return (
        <h2 className="title" {...rest}>
          {title}
        </h2>
      );
    case "large":
      return (
        <h1 className="title" {...rest}>
          {title}
        </h1>
      );
    default:
      return null;
  }
};
