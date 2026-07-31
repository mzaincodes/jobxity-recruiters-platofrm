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

const JobListingsTable = () => {
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
          `/api/application/get-applications-by-recruiter`,
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
          console.log("firsrrrrt", res?.data.applications);
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
                {/* <th>Date Applied</th> */}
                <th>Job Status</th>
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
                            href={`/job-single-v1/${item?.job_id}`}
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
                  {/* <td>{item?.candidate_name}</td> */}
                  {/* <td>{convertTimestampToDate(item?.createdAt)}</td> */}
                  <td>{(item?.jobStatus  === 0 ? "Closed" : "Open " )}</td>
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

export default JobListingsTable;
