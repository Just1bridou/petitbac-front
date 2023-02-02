import "./style.css";

const CustomMultiple = ({ title, description, onClick, ...rest }) => {
  return (
    <div className="switchMultiple" onClick={onClick} {...rest}>
      <div className="switchMultipleHeader">
        <div className="switchMultipleTitle">{title}</div>
      </div>

      <div className="switchMultipleBody">
        <div className="switchMultipleDescription">{description}</div>
      </div>
    </div>
  );
};

export const MultipleSwitch = ({ items, selected, onClick }) => {
  return items.map((item, index) => {
    return (
      <CustomMultiple
        key={index}
        title={item.title}
        description={item.description}
        onClick={() => onClick(item.code)}
        style={{
          backgroundColor: selected === item.code ? "#EEC643" : "",
        }}
      />
    );
  });
};
