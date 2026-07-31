import SearchForm3 from "../../common/job-search/SearchForm3";
import PopularSearch from "../PopularSearch";

const index = () => {
  return (
    <section
      className="d-flex justify-content-center align-items-center flex-column hero-4 flex-column"
      style={{
        backgroundImage: "url(/images/background/2.png)",
        height: "500px",
      }}
    >
      <div className="auto-container">
        <div className="cotnent-box">
          <div className="title-box mb-5">
            <p
              style={{ fontSize: "2.5vw", marginBottom: "20px" }}
              className="text-white text-center"
            >
              Aim Higher. Reach Farther. Dream Bigger.
            </p>
            <p
              style={{ fontSize: "1vw", fontWeight: 500, marginBottom: "20px" }}
              className="text-white text-center"
            >
              {" "}
              A better career is out there. We'll help you find it. We're your
              first step to becoming everything you want to be.
            </p>
          </div>

          {/* <!-- Job Search Form --> */}
          <div className="job-search-form">
            <SearchForm3 btnStyle="btn-style-two" />
          </div>
        </div>
        {/* <!-- Job Search Form --> */}

        {/* <!-- Popular Search --> */}
        {/* <PopularSearch /> */}
        {/* <!-- End Popular Search --> */}
      </div>
    </section>
  );
};

export default index;
