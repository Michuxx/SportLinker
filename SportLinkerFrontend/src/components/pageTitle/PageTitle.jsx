import "./pageTitle.css";

const PageTitle = ({ header, label }) => {
  return (
    <div className="page-title-wrapper">
      <h1>{header}</h1>
      <p>{label}</p>
    </div>
  );
};

export default PageTitle;
