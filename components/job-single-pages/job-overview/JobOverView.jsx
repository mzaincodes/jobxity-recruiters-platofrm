import { formatSalary, getCurrencySymbol } from "@/utils/helping-func";
import React from "react";

const JobOverView = ({
  datePosted,
  expirationDate,
  location,
  jobTitle,
  hours,
  rate,
  minSalary,
  maxSalary,
  currency,
}) => {
  return (
    <div className="widget-content">
      <ul className="job-overview">
        <li>
          <i className="icon icon-calendar"></i>
          <h5>Date Posted:</h5>
          <span>{datePosted}</span>
        </li>
        <li>
          <i className="icon icon-expiry"></i>
          <h5>Deadline:</h5>
          <span>{expirationDate}</span>
        </li>
        <li>
          <i className="icon icon-user-2"></i>
          <h5>Industry:</h5>
          <span>{jobTitle}</span>
        </li>
        <li>
          <i className="icon icon-clock"></i>
          <h5>Job Type:</h5>
          <span>{hours}</span>
        </li>
        <li>
          <i className="icon icon-salary"></i>
          <h5>Salary ({currency}) :</h5>
          <span>
            {minSalary && maxSalary
              ? `${getCurrencySymbol(currency)}${formatSalary(
                  minSalary
                )} - ${getCurrencySymbol(currency)}${formatSalary(maxSalary)}`
              : minSalary
              ? `${getCurrencySymbol(currency)}${formatSalary(minSalary)}`
              : "Salary not available"}
          </span>
        </li>
        <li>
          <i className="icon icon-location"></i>
          <h5>Address:</h5>
          <span>{location}</span>
        </li>
      </ul>
    </div>
  );
};

export default JobOverView;
