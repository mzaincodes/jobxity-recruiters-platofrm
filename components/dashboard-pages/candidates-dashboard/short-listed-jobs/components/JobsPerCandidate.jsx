"use client";
import Link from "next/link.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  convertTimestampToDate,
  getStatusLabel,
  timeAgo,
} from "@/utils/helping-func.js";
import { HashLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const JobsPerCandidate = ({jobId}) => {
  const { data: session } = useSession();
  const [id, setId] = useState();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#1966d2");
  const [totalApplications, setTotalApplications] = useState(0);
  // Pagination state

  // Number of records per page
  const itemsPerPage = 15;

  useEffect(() => {
    setId(session?.user?.id);
  }, [session]);

  console.log("super", applications);
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        console.log("wdfefwef", id, jobId);
        const res = await axios.post(
          `/api/application/get-applications-per-recruiter-job`,
          { recruiter_id: id, job_id: jobId },
          {
            headers: {
              "Content-Type": "application/json", // Ensure the content type is JSON
            },
          }
        );
        console.log("super333", res);
        if (res.status === 200) {
          setLoading(false);
          setApplications(res?.data.applications);
          setTotalApplications(res?.data?.applications?.length);
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
  }, [id]); 


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
    <div className="tabs-box mt-5" style={{ width: "100%" }}>
      <div className="widget-title mb-3">
        <h4>Submitted Profiles for this job: {totalApplications}</h4>
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Profile Submitted At</th>
                <th>Status</th>
                <th>Status Updated At</th>
              </tr>
            </thead>

            <tbody>
              {applications?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <h4>
                          <Link href={`/candidates-single-v1/${item?.application_id}`}>
                            {item?.candidate_name}
                          </Link>
                        </h4>
                   
                      </div>
                    </div>
                  </td>
                  <td>{convertTimestampToDate(item?.createdAt)}</td>
                  <td>{getStatusLabel(item?.status)}</td>
                  <td>{timeAgo(item?.updatedAt)}</td>
                  {/* <td>{item?.candidate_id?.location}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      
   
   
      </div>
    </div>
  );
};

export default JobsPerCandidate;
