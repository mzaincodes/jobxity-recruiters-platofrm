import React from "react";

const JobSkills = ({ skills = [] }) => {
  return (
    <ul className="job-skills">
      {skills?.map((skill, index) => (
        <li key={index}>
          <a href="#">{skill}</a>
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
