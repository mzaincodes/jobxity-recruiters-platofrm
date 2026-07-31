"use client";

import Link from "next/link";
import Pagination from "../components/Pagination";
import {
  experienceOptions,
  industries,
  jobTypes,
  salaryRange,
} from "@/data/mydata";
import { HashLoader } from "react-spinners";
import { useJobContext } from "@/app/context/JobContext";
import {
  formatSalary,
  getJobTypeLabel,
  getJobModeLabel,
  getCurrencySymbol,
} from "@/utils/helping-func";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const FilterJobBox = () => {
  const {
    loading,
    filters,
    setFilters,
    jobList,
    totalJobs,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useJobContext();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: "",
      experience: "",
      industry: "",
      salary: "",
    });
  };
  const isFilterApplied = Object.values(filters).some((value) => value !== "");

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
          color="#1966d2"
          loading={loading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  return (
    <>
      <div
        style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px" }}
      >
        Showing {totalJobs} jobs{" "}
      </div>
      <div className="ls-switcher">
        <div className="showing-result">
          <div className="top-filters">
            <div className="form-group">
              <select
                name="jobType"
                className="chosen-single form-select"
                onChange={handleFilterChange}
                value={filters.jobType}
              >
                <option value="">Job Type</option>
                {jobTypes?.map((job) => (
                  <option key={job.value} value={job.value}>
                    {job.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                name="experience"
                className="chosen-single form-select"
                onChange={handleFilterChange}
                value={filters.experience}
              >
                <option value="">Experience Level</option>
                {experienceOptions.map((experience) => (
                  <option key={experience.value} value={experience.value}>
                    {experience.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                name="industry"
                className="chosen-single form-select"
                onChange={handleFilterChange}
                value={filters.industry}
              >
                <option value="">Industry</option>
                {industries.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <select
                name="salary"
                className="chosen-single form-select"
                onChange={handleFilterChange}
                value={filters.salary}
              >
                <option value="">Salary Estimate</option>
                {salaryRange.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="sort-by lg-mt-4">
          {isFilterApplied && (
            <button
              className="btn btn-danger text-nowrap me-2"
              onClick={clearFilters}
              style={{ minHeight: "45px" }}
            >
              Clear All
            </button>
          )}

          {/* <select className="chosen-single form-select">
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select> */}
        </div>
      </div>
      <div className="row">
        <div className="row">
          {jobList.length > 0 ? (
            jobList.map((item) => (
              <div
                className="job-block col-lg-6 col-md-12 col-sm-12"
                key={item._id}
              >
                <Link href={`/job-single-v1/${item._id}`}>
                  <div className="inner-box">
                    <h4>{item.jobTitle}</h4>
                    <ul className="job-info">
                      <li>
                        <span className="icon flaticon-briefcase"></span>
                        {getJobModeLabel(item?.jobMode)}
                      </li>
                      <li>
                        <span className="icon flaticon-clock-3"></span>
                        {item?.jobType
                          ? getJobTypeLabel(item?.jobType)
                          : "No job type available"}
                      </li>
                      <li>
  <span className="icon flaticon-money"></span>{" "}
  {
    item?.minSalary && item?.maxSalary
      ? `${getCurrencySymbol(item.currency)}${formatSalary(item.minSalary)} - ${getCurrencySymbol(item.currency)}${formatSalary(item.maxSalary)}`
      : item?.minSalary
      ? `${getCurrencySymbol(item.currency)}${formatSalary(item.minSalary)}`
      : "Salary not available"
  }
</li>


                      <li>
                        <span className="icon flaticon-map-locator"></span>
                        {item?.address?.city}
                      </li>
                    </ul>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="no-results-message my-5">No jobs found</p>
            </div>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-3">
        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default FilterJobBox;
