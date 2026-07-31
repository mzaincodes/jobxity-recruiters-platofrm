"use client";
import React, { useState, useEffect } from "react";

function Count() {
  // Set initial state for the counts
  const [jobsAdded, setJobsAdded] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeRecruiters, setActiveRecruiters] = useState(0);

  // Define target values
  const jobTarget = 100000;
  const userTarget = 24312;
  const recruiterTarget = 9421;

  // Function to increase values gradually
  useEffect(() => {
    const duration = 6000; // 6 seconds
    const steps = 100; // Number of steps to take to reach the target
    const intervalTime = duration / steps; // Time for each step

    // Increment jobs added
    const jobInterval = setInterval(() => {
      setJobsAdded((prev) => {
        if (prev < jobTarget) return prev + Math.ceil(jobTarget / steps);
        clearInterval(jobInterval);
        return jobTarget;
      });
    }, intervalTime);

    // Increment active users
    const userInterval = setInterval(() => {
      setActiveUsers((prev) => {
        if (prev < userTarget) return prev + Math.ceil(userTarget / steps);
        clearInterval(userInterval);
        return userTarget;
      });
    }, intervalTime);

    // Increment active recruiters
    const recruiterInterval = setInterval(() => {
      setActiveRecruiters((prev) => {
        if (prev < recruiterTarget) return prev + Math.ceil(recruiterTarget / steps);
        clearInterval(recruiterInterval);
        return recruiterTarget;
      });
    }, intervalTime);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(jobInterval);
      clearInterval(userInterval);
      clearInterval(recruiterInterval);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="container">
        <div className="column">
          <h2>{jobsAdded.toLocaleString()}</h2>
          <div className="countheading">Jobs Added</div>
        </div>
        <div className="column">
          <h2>{activeUsers.toLocaleString()}</h2>
          <div  className="countheading">Active Users</div>
        </div>
        <div className="column">
          <h2>{activeRecruiters.toLocaleString()}</h2>
          <div  className="countheading">Active Recruiters</div>
        </div>
      </div>
    </div>
  );
}

export default Count;
