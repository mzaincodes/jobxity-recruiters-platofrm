"use client";
// import { useState } from "react";
// import Categories from "../components/Categories";
// import LocationBox from "../components/LocationBox";
// import SearchBox from "../components/SearchBox";

// const JobSearchForm = () => {
//   const [searchText, setSearchText] = useState("");

//   const handleSearchChange = (text) => {
//     setSearchText(text); // Update the search text state in the parent
//     console.log("searchText", searchText);
//   };

//   return (
//     <div className="job-search-form">
//       <div className="row">
//         <div className="form-group col-lg-4 col-md-12 col-sm-12">
//           <>
//             <input // get query string fom here on changing of text and on press of button make api call in context
//               type="text"
//               name="listing-search"
//               placeholder="Job title, keywords, or company"
//             />
//             <span className="icon flaticon-search-3"></span>
//           </>{" "}
//         </div>
//         {/* <!-- Form Group --> */}

//         <div className="form-group col-lg-4 col-md-12 col-sm-12 location">
//           <>
//             <input
//               type="text"
//               name="listing-search"
//               placeholder="City or postcode"
//             />
//             <span className="icon flaticon-map-locator"></span>
//           </>{" "}
//         </div>
//         {/* <!-- Form Group --> */}

//         {/* <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
//           <Categories />
//         </div> */}
//         {/* <!-- Form Group --> */}

//         <div className="form-group col-lg-4 col-md-12 col-sm-12 text-right">
//           <button type="submit" className="theme-btn btn-style-one">
//             Find Jobs
//           </button>
//         </div>
//         {/* <!-- Form Group --> */}
//       </div>
//     </div>
//     // End job Search form
//   );
// };

// export default JobSearchForm;"use client";




import { useState } from "react";
import { useJobContext } from "@/app/context/JobContext";

const JobSearchForm = () => {
  const { setSearchQuery, fetchJobs, searchQuery } = useJobContext();
  const [searchText, setSearchText] = useState(searchQuery); // Keep local state for search input

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Function to handle search
  const handleSearchSubmit = () => {
    setSearchQuery(searchText); // Update query state

  };

  // Function to handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleSearchSubmit(); // Call search function
    }
  };

  return (
    <div className="job-search-form" id="top-result">
      <div className="row">
        <div className="form-group col-lg-9 col-md-12 col-sm-12">
          <input
            type="text"
            placeholder="Enter Job title i.e. accountant"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress} // Listen for Enter key press
          />
          <span className="icon flaticon-search-3"></span>
        </div>

        <div className="form-group col-lg-3 col-md-12 col-sm-12 text-right">
          <button
            type="button"
            style={{ fontSize: "20px" }}
            className="theme-btn btn-style-one"
            onClick={handleSearchSubmit}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSearchForm;
