// import Link from "next/link.js";
// import jobs from "../../../../../data/job-featured.js";
// import Image from "next/image.js";

// const JobFavouriteTable = () => {
//   return (
//     <div className="tabs-box">
//       <div className="widget-title">
//         <h4>My Favorite Jobs</h4>

//         <div className="chosen-outer">
//           {/* <!--Tabs Box--> */}
//           <select className="chosen-single form-select">
//             <option>Last 6 Months</option>
//             <option>Last 12 Months</option>
//             <option>Last 16 Months</option>
//             <option>Last 24 Months</option>
//             <option>Last 5 year</option>
//           </select>
//         </div>
//       </div>
//       {/* End filter top bar */}

//       {/* Start table widget content */}
//       <div className="widget-content">
//         <div className="table-outer">
//           <div className="table-outer">
//             <table className="default-table manage-job-table">
//               <thead>
//                 <tr>
//                   <th>Job Title</th>
//                   <th>Date Applied</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {jobs.slice(8, 12).map((item) => (
//                   <tr key={item.id}>
//                     <td>
//                       {/* <!-- Job Block --> */}
//                       <div className="job-block">
//                         <div className="inner-box">
//                           <div className="content">
//                             <span className="company-logo">
//                               <Image
//                                 width={48}
//                                 height={48}
//                                 src={item.logo}
//                                 alt="logo"
//                               />
//                             </span>
//                             <h4>
//                               <Link href={`/job-single-v3/${item.id}`}>
//                                 {item.jobTitle}
//                               </Link>
//                             </h4>
//                             <ul className="job-info">
//                               <li>
//                                 <span className="icon flaticon-briefcase"></span>
//                                 Segment
//                               </li>
//                               <li>
//                                 <span className="icon flaticon-map-locator"></span>
//                                 London, UK
//                               </li>
//                             </ul>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>Dec 5, 2020</td>
//                     <td className="status">Active</td>
//                     <td>
//                       <div className="option-box">
//                         <ul className="option-list">
//                           <li>
//                             <button data-text="View Aplication">
//                               <span className="la la-eye"></span>
//                             </button>
//                           </li>
//                           <li>
//                             <button data-text="Delete Aplication">
//                               <span className="la la-trash"></span>
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       {/* End table widget content */}
//     </div>
//   );
// };

// export default JobFavouriteTable;



"use client";
import Link from "next/link.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  convertTimestampToDate,
  getJobTypeLabel,
  getStatusLabel,
} from "@/utils/helping-func.js";
import { HashLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const JobFavouriteTable = () => {
  const { data: session } = useSession();
  const [id, setId] = useState();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#1966d2");
  const [totalApplications, setTotalApplications] = useState(0);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Number of records per page
  const itemsPerPage = 15;

  useEffect(() => {
    setId(session?.user?.id);
  }, [session]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await axios.post(
          `/api/application/get-hired-applications`,
          { _id: id, page: currentPage, limit: itemsPerPage },
          {
            headers: {
              "Content-Type": "application/json", // Ensure the content type is JSON
            },
          }
        );
        if (res.status === 200) {
          setLoading(false);
          setApplications(res?.data.applications);
          const totalCount = res?.data.totalCount;
          setTotalApplications(res?.data.totalCount);
          setTotalPages(Math.ceil(totalCount / itemsPerPage)); // Calculate total pages
        }
      } catch (error) {
        setLoading(false);
        console.error(
          "Error fetching job details:",
          error?.response?.data?.error
        );
      }
    };

    fetchJob();
  }, [id, currentPage]); // Fetch when currentPage changes

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "50vh",
        }}
      >
        <HashLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  // Pagination UI
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

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Total Job Applications: {totalApplications}</h4>
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Candidate Name</th>
                <th>Date Applied</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {applications?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <h4>
                          <Link
                            href={`/candidates-single-v1/${item?.application_id}`}
                          >
                            {item.jobTitle}
                          </Link>
                        </h4>
                        <ul className="job-info">
                          <li>
                            <span className="icon flaticon-map-locator"></span>
                            {item?.address?.city}, {item?.address?.country}
                          </li>
                          <li>
                            <span className="icon flaticon-clock-3"></span>
                            {getJobTypeLabel(item?.jobType)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                  <td>{item?.candidate_name}</td>
                  <td>{convertTimestampToDate(item?.createdAt)}</td>
                  <td>{getStatusLabel(item?.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center">
            <p>No applications found.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default JobFavouriteTable;
