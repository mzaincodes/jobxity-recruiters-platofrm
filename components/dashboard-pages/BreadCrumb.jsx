import MenuToggler from "./MenuToggler";

const BreadCrumb = ({ title = "" }) => {
  return (
    <div className="upper-title-box d-flex justify-content-between align-items-center">
      <h3>{title}</h3>
      <MenuToggler />
      {/* <div className="text">Ready to jump back in?</div> */}
    </div>
  );
};

export default BreadCrumb;
