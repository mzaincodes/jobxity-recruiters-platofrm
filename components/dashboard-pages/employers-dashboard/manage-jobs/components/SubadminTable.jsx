"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { getIndustryLabel, getJobTypeLabel } from "@/utils/helping-func.js";

// Loader styles for the loading spinner
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const SubadminTable = () => {
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#1966d2");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/user/sub-admin/get-sub-admins`);

        setAdminList(response?.data);
        console.log("Data fetched:", response?.data); // Log the response directly
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // This will run whenever adminList changes
  useEffect(() => {
    console.log("Updated adminList:", adminList);
  }, [adminList]); // This will trigger on every change to adminList

  // Convert timestamp to date
  function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  }

  if (loading) {
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
  }

  return (
    <div className="tabs-box mt-5">
      <div className="widget-title">
        <h4>Existing Sub Admins</h4>
      </div>

      <div className="table-outer">
        <table className="default-table manage-job-table">
          <thead>
            <tr >
              <th >Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Account Created On </th>
              <th className="text-center">Total Job Posted </th>
              <th className="text-center">Hired Candidates </th>
            </tr>
          </thead>

          <tbody>
            {adminList.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="job-block">
                    <div className="inner-box">
                      <h6>{item.name}</h6>
            
                    </div>
                  </div>
                </td>
                <td className="text-center">{item?.email}</td>
                <td className="text-center">{convertTimestampToDate(item?.createdAt)}</td>
                <td className="text-center">{item?.jobCount}</td>
                <td className="text-center">{item?.applicationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubadminTable;
