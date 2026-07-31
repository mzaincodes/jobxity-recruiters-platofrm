"use client";
import Link from "next/link.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { convertTimestampToDate } from "@/utils/helping-func.js";
import { HashLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const RecruitersPerJob = ({ jobId }) => {
  const [recruiterList, setRecruiterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#1966d2");
  console.log("dfwerfef", recruiterList);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `/api/application/get-applications-per-job`,
          { job_id: jobId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

      
        
        if (res.status === 200) {
          setLoading(false);
          setRecruiterList(res?.data);
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
  }, []);

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
      <div className="widget-title mb-3">
        <h4>Recruiters who submitted profiles {recruiterList?.length}</h4>
      </div>

      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Recruiter Name</th>
                <th className="text-center">Submitted Profiles</th>
                <th className="text-center">Account Created on</th>
              </tr>
            </thead>

            <tbody>
              {recruiterList?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="job-block">
                      <div className="inner-box">
                        <h4>
                          <Link
                            href={`/candidates-single-v2/${item?.recruiterId}`}
                          >
                            {item?.name}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">{item?.count}</td>
                  <td className="text-center">
                    {convertTimestampToDate(item?.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruitersPerJob;
