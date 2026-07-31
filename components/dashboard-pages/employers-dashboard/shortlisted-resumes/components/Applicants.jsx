// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { getAllCandidates } from "@/lib/api";

// const Applicants = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCandidates() {
//       setLoading(true);
//       const data = await getAllCandidates();
//       console.log("wefwrf", data)
//       setCandidates(data);
//       setLoading(false);
//     }
//     fetchCandidates();
//   }, []);

//   return (
//     <div className="container">
//        <div className="job-search-form mx-3 p-2" id="top-result">
//         <div className="row">
//           <div className="form-group col-lg-10 col-md-12 col-sm-12">
//             <input
//               type="text"
//               placeholder="Enter job title"
//               value={()=>""}
//               onChange={()=>""}
//               onKeyDown={()=>""}
//             />
//             <span className="icon flaticon-search-3"></span>
//           </div>

//           <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right d-flex align-items-center justify-content-center">
//             <button
//               type="button"
//               style={{ fontSize: "20px", width: "100px", height: "40px" }}
//               className="theme-btn btn-style-one"
//               onClick={()=>""}
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="row">
//         {loading ? (
//           <div className="text-center w-100">
//             <p>Loading candidates...</p>
//           </div>
//         ) : candidates.length > 0 ? (
//           candidates.map((candidate) => (
//             <div
//               className="company-block-four col-xl-3 col-lg-6 col-md-6 col-sm-12"
//               key={candidate._id}
//             >
//               <div className="inner-box">
//                 <div className="content-inner">
//                   <span className="featured">Featured</span>
//                   <span className="company-logo">
//                     <Image
//                       width={50}
//                       height={50}
//                       src={
//                         candidate.pic ||
//                         "/images/user.png"
//                       }
//                       alt="candidate avatar"
//                     />
//                   </span>
//                   <h4>
//                     <Link href={`/candidates-single-v3/${candidate._id}`}>
//                       {candidate.name || "No Name"}
//                     </Link>
//                   </h4>
//                   <ul className="job-info flex-column">
//                     <li className="">
//                       {candidate.email || "Email not available"}
//                     </li>
//                     <li className="">
//                     {candidate.phone || "Phone not available"}                    </li>

//                   </ul>
//                 </div>

//                 <div className="job-type me-0">
//                   {candidate.createdBy?.name || "Self"}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center w-100">
//             <p>No candidates found.</p>
//           </div>
//         )}
//       </div>

//       <div className="d-flex pb-5 justify-content-center align-items-center gap-5 mt-3">
//         <button
//           onClick={()=>""}
//           disabled={()=>""}
//           style={{
//             width: "70px",
//             height: "40px",
//             borderRadius: "10px",
//             backgroundColor: "#1966D2",
//             color: "white",
//           }}
//         >
//           <i className="fa fa-arrow-left"></i>
//         </button>
//         <span>
//           Page {()=>""} of {()=>""}
//         </span>
//         <button
//           onClick={()=>""}
//           disabled={()=>""}
//           style={{
//             width: "70px",
//             height: "40px",
//             borderRadius: "10px",
//             backgroundColor: "#1966D2",
//             color: "white",
//           }}
//         >
//           <i className="fa fa-arrow-right"></i>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Applicants;

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import axios from "axios"; // Use axios to make API requests
// import Loader from "@/components/my-components/Loader";

// const Applicants = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchText, setSearchText] = useState("");
//   const [totalCount, setTotalCount] = useState("");

//   const itemsPerPage = 100; // Number of candidates per page

//   // Fetch candidates with pagination and search
//   const fetchCandidates = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/api/user/candidate/get-candidates`, {
//         params: {
//           page: currentPage,
//           limit: itemsPerPage,
//           searchQuery: searchText,
//         },
//       });
//       setCandidates(response.data.recruiters);
//       setTotalPages(response.data.totalPages);
//       setTotalCount(response.data.totalCount);
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, [currentPage]); // Fetch candidates when the page or search text changes

//   // Handle page change
//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Handle search change
//   const handleSearchChange = (e) => {
//     setSearchText(e.target.value);
//   };

//   // Handle search submit
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to the first page when new search is made
//     fetchCandidates(); // Re-fetch candidates after search query
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       setCurrentPage(1);
//       fetchCandidates();
//     }
//   };
//   return (
//     <div className="container">
//       {/* Search form */}
//       <div className="widget-title">
//         <h4>{totalCount} Candidates Found</h4>

//         {/* <div
//           style={{
//             backgroundClip: "pink",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 20,
//           }}
//         >
//           {showClearButton && (
//             <button
//               onClick={clearAll}
//               className="btn btn-danger mt-3"
//               style={{
//                 minHeight: "45px",
//                 marginBottom: "15px",
//               }}
//             >
//               Clear All
//             </button>
//           )}
//           <select
//             style={{ width: "140px" }}
//             className="chosen-single form-select"
//             value={timeRange}
//             onChange={handleTimeRangeChange}
//           >
//             <option value="">Select Time</option>
//             <option value="lastWeek">Last Week</option>
//             <option value="lastMonth">Last Month</option>
//             <option value="last3Months">Last 3 Months</option>
//             <option value="last6Months">Last 6 Months</option>
//             <option value="lastYear">Last Year</option>
//           </select>
//           <select
//             style={{ width: "140px" }}
//             className="chosen-single form-select"
//             value={jobStatus}
//             onChange={handleJobStatusChange}
//           >
//             <option value="">Select Status</option>
//             <option value="1">Open</option>
//             <option value="0">Closed</option>
//           </select>
//           <select
//             style={{ width: "140px" }}
//             className="chosen-single form-select"
//             value={jobType}
//             onChange={handleJobTypeChange}
//           >
//             <option value="">Select Job Type</option>
//             {jobTypes.map((type) => (
//               <option key={type.value} value={type.value}>
//                 {type.label}
//               </option>
//             ))}
//           </select>
//         </div> */}
//       </div>

//       <div className="job-search-form mx-3 p-2" id="top-result">
//         <div className="row">
//           {/* Search input section */}
//           <div className="form-group col-lg-10 col-md-12 col-sm-12">
//             <input
//               type="text"
//               placeholder="Enter Candidate name"
//               value={searchText}
//               onChange={handleSearchChange}
//               onKeyDown={handleKeyDown} // Listen for the Enter key press to trigger search
//             />
//             <span className="icon flaticon-search-3"></span>
//           </div>

//           {/* Search button section */}
//           <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right d-flex align-items-center justify-content-center">
//             <button
//               type="button"
//               style={{
//                 fontSize: "20px",
//                 width: "100px",
//                 height: "40px",
//                 backgroundColor: "#1966D2",
//                 color: "white",
//                 borderRadius: "5px",
//               }}
//               className="theme-btn btn-style-one"
//               onClick={handleSearchSubmit}
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         {/* Loading or displaying candidates */}
//         {loading ? (
//           <div className="text-center w-100">
//             <Loader />
//           </div>
//         ) : candidates.length > 0 ? (
//           candidates.map((candidate) => (
//             <div
//               className="company-block-four col-xl-3 col-lg-6 col-md-6 col-sm-12"
//               key={candidate._id}
//             >
//               <div className="inner-box">
//                 <div className="content-inner">
//                   <span className="featured">Featured</span>
//                   <span className="company-logo">
//                     <Image
//                       width={50}
//                       height={50}
//                       src={candidate.pic || "/images/user.png"}
//                       alt="candidate avatar"
//                     />
//                   </span>
//                   <h4>
//                     <Link href={`/candidates-single-v3/${candidate._id}`}>
//                       {candidate.name || "No Name"}
//                     </Link>
//                   </h4>
//                   <ul className="job-info flex-column">
//                     <li>{candidate.email || "Email not available"}</li>
//                     <li>{candidate.phone || "Phone not available"}</li>
//                   </ul>
//                 </div>

//                 <div className="job-type me-0">
//                   {candidate.createdBy?.name || "Self"}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center w-100">
//             <p>No candidates found.</p>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="d-flex justify-content-center align-items-center gap-5 mt-3">
//         <button
//           onClick={handlePrevPage}
//           disabled={currentPage === 1}
//           style={{
//             width: "70px",
//             height: "40px",
//             borderRadius: "10px",
//             backgroundColor: "#1966D2",
//             color: "white",
//           }}
//         >
//           <i className="fa fa-arrow-left"></i>
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           style={{
//             width: "70px",
//             height: "40px",
//             borderRadius: "10px",
//             backgroundColor: "#1966D2",
//             color: "white",
//           }}
//         >
//           <i className="fa fa-arrow-right"></i>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Applicants;





































"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios"; // Use axios to make API requests
import Loader from "@/components/my-components/Loader";
import { statuses } from "@/data/mydata";

const Applicants = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState("");
  const [status, setStatus] = useState(""); // Status filter
  const [source, setSource] = useState(""); // Source filter
  const [showClearButton, setShowClearButton] = useState(false); // Show clear button only if any filter is applied

  const itemsPerPage = 100; // Number of candidates per page

  // Fetch candidates with pagination and filters
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/candidate/get-candidates`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          searchQuery: searchText,
          status, // Pass status filter
          source, // Pass source filter
        },
      });
      setCandidates(response.data.recruiters);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, status, source, searchText]); // Re-fetch when page, filters, or search text change

  // Handle page change
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when new search is made
    fetchCandidates(); // Re-fetch candidates after search query
  };

  // Handle Status Filter Change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Handle Source Filter Change
  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  // Handle Clear All Filters
  const clearAll = () => {
    setSearchText("");
    setStatus("");
    setSource("");
    setCurrentPage(1);
    setShowClearButton(false); // Hide clear button after reset
    fetchCandidates();
  };

  useEffect(() => {
    // Enable "Clear All" button if any filter or search text is applied
    if (searchText || status || source) {
      setShowClearButton(true);
    } else {
      setShowClearButton(false);
    }
  }, [searchText, status, source]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1);
      fetchCandidates();
    }
  };

  return (
    <div>
      <div className="widget-title">
        <h4>{totalCount} Candidates Found</h4>
        {/* Filters and Clear All Button */}

        {/* Filters UI */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* Status Filter */}
          {showClearButton && (
            <button
              onClick={clearAll}
              className="btn btn-danger mt-3"
              style={{
                minHeight: "45px",
                marginBottom: "15px",
              }}
            >
              Clear All
            </button>
          )}
          <select
            className="chosen-single form-select"
            value={status}
            onChange={handleStatusChange}
            style={{ width: "200px" }}
          >
            <option value="">Select Status</option>
            {statuses.map((statusItem) => (
              <option key={statusItem.value} value={statusItem.value}>
                {statusItem.label}
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            style={{ width: "140px" }}
            className="chosen-single form-select"
            value={source}
            onChange={handleSourceChange}
          >
            <option value="">Select Source</option>
            <option value="self">Self</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
      </div>

      <div className="job-search-form mx-3 p-2" id="top-result">
        <div className="row">
          {/* Search input section */}
          <div className="form-group col-lg-10 col-md-12 col-sm-12">
            <input
              type="text"
              placeholder="Enter Candidate name"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Listen for the Enter key press to trigger search
            />
            <span className="icon flaticon-search-3"></span>
          </div>

          {/* Search button section */}
          <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right d-flex align-items-center justify-content-center">
            <button
              type="button"
              style={{
                fontSize: "20px",
                width: "100px",
                height: "40px",
                backgroundColor: "#1966D2",
                color: "white",
                borderRadius: "5px",
              }}
              className="theme-btn btn-style-one"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Loading or displaying candidates */}
        {loading ? (
          <div className="text-center w-100">
            <Loader />
          </div>
        ) : candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div
              className="company-block-four col-xl-3 col-lg-6 col-md-6 col-sm-12"
              key={candidate._id}
            >
                    <Link href={`/candidates-single-v3/${candidate._id}`}>
              <div className="inner-box">
                <div className="content-inner">
                  <span className="featured">Featured</span>
                  <span className="company-logo">
                    <Image
                      width={50}
                      height={50}
                      src={candidate.pic || "/images/user.png"}
                      alt="candidate avatar"
                    />
                  </span>
                  <h4>
                      {candidate.name || "No Name"}
                  </h4>
                  <ul className="job-info flex-column">
                    <li>{candidate.email || "Email not available"}</li>
                    <li>{candidate.phone || "Phone not available"}</li>
                  </ul>
                </div>

                <div className="job-type me-0">
                  {candidate.createdBy?.name || "Self"}
                </div>
              </div>
                    </Link>
            </div>
          ))
        ) : (
          <div className="text-center w-100">
            <p>No candidates found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-5 mt-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            width: "70px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "#1966D2",
            color: "white",
          }}
        >
          <i className="fa fa-arrow-left"></i>
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            width: "70px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "#1966D2",
            color: "white",
          }}
        >
          <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Applicants;
