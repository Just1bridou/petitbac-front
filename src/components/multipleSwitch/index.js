import "./style.css";

const CustomCard = ({ title, description, onClick, ...rest }) => {
  return (
    <div className="switchCard" onClick={onClick} {...rest}>
      <div className="switchCardHeader">
        <div className="switchCardTitle">{title}</div>
      </div>

      <div className="switchCardBody">
        <div className="switchCardDescription">{description}</div>
      </div>
    </div>
  );
};

export const MultipleSwitch = ({ items, selected }) => {
  return items.map((item, index) => {
    return (
      <CustomCard
        key={index}
        title={item.title}
        description={item.description}
        onClick={() => console.log(item.code)}
        style={{
          backgroundColor: selected === item.code ? "#EEC643" : "",
        }}
      />
    );
  });
};
