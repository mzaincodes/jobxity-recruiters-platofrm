"use client";
import Link from "next/link.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  convertTimestampToDate,
  formatApplicationId,
  getStatusLabel,
  timeAgo,
} from "@/utils/helping-func.js";
import { HashLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const JobsPerCandidate = ({ jobId }) => {
  const { data: session } = useSession();
  const [id, setId] = useState();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#1966d2");
  const [totalApplications, setTotalApplications] = useState(0);
  const [filterSource, setFilterSource] = useState("mySubmitted");

  const filteredApplications = applications.filter((app) => {
    if (filterSource === "mySubmitted") {
      return app.isFromSocialMedia === false;
    } else if (filterSource === "fromSocialMedia") {
      return app.isFromSocialMedia === true;
    }
    return true;
  });

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
          console.log("nbvbfxcfcghv ", res?.data??applications);
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

  return (
    <div className="tabs-box mt-5" style={{ width: "100%" }}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
        <h4>Submitted Profiles for this job: {filteredApplications.length}</h4>
        <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
          <div>
            <input
              type="radio"
              id="mySubmitted"
              name="source"
              value="mySubmitted"
              checked={filterSource === "mySubmitted"}
              onChange={() => setFilterSource("mySubmitted")}
              style={{ marginRight: "8px" }}
            />
            <label htmlFor="mySubmitted">My Submitted</label>
          </div>
          <div>
            <input
              type="radio"
              id="fromSocialMedia"
              name="source"
              value="fromSocialMedia"
              checked={filterSource === "fromSocialMedia"}
              onChange={() => setFilterSource("fromSocialMedia")}
              style={{ marginRight: "8px" }}
            />
            <label htmlFor="fromSocialMedia">From Social Media</label>
          </div>
        </div>
      </div>


      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Candidate Name</th>
                <th>Profile Submitted At</th>
                <th>Status</th>
                <th>Status Updated At</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item?.isFromSocialMedia ? "Social Media" : "You Submitted"}
                    <div>ID: {formatApplicationId(item?.applicationId)}</div>
                  </td>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <Link href={`/candidates-single-v1/${item?.application_id}`}>
                          {item?.candidate_name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>{convertTimestampToDate(item?.createdAt)}</td>
                  <td>{getStatusLabel(item?.status)}</td>
                  <td>{timeAgo(item?.updatedAt)}</td>
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
