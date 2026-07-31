// "use client";

// import { industries } from "@/data/mydata";
// import { useRouter } from "next/navigation";
// import { City } from "country-state-city";
// import { useEffect, useState } from "react";
// const SearchForm3 = () => {
//   const router = useRouter();
//   const handleSubmit = (event) => {
//     event.preventDefault();
//   };
//   const [cities, setCities] = useState([]);
//   const [selectedCity, setSelectedCity] = useState("");

//   useEffect(() => {
//     const punjabCities = City.getCitiesOfState("PK", "PB"); // PK = Pakistan, PB = Punjab
//     setCities(punjabCities);
//   }, []);

//   return (
//     <form onClick={handleSubmit}>
//       <div className="row">
//         {/* <!-- Form Group --> */}
//         <div className="form-group col-lg-4 col-md-12 col-sm-12">
//           <span className="icon flaticon-search-1"></span>
//           <input
//             type="text"
//             name="field_name"
//             placeholder="Job title, keywords, or company"
//           />
//         </div>

//         {/* <!-- Form Group --> */}
//         <div className="form-group col-lg-3 col-md-12 col-sm-12 category">
//           <span className="icon flaticon-map-locator"></span>
//           <select
//             className="chosen-single form-select"
//             value={selectedCity}
//             onChange={(e) => setSelectedCity(e.target.value)}
//           >
//             <option value="">All Cities</option>
//             {cities.map((city) => (
//               <option key={city.name} value={city.name}>
//                 {city.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* <!-- Form Group --> */}
//         <div className="form-group col-lg-3 col-md-12 col-sm-12 category">
//           <span className="icon flaticon-briefcase"></span>
//           <select className="chosen-single form-select" defaultValue="">
//             <option value="">All Categories</option>
//             {industries.map((industry) => (
//               <option key={industry.value} value={industry.value}>
//                 {industry.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* <!-- Form Group --> */}
//         <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
//           <button
//             type="submit"
//             className="theme-btn btn-style-one"
//             onClick={() => router.push("/job-list-v3")}
//           >
//             Find Jobs
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default SearchForm3;




"use client";

import { industries } from "@/data/mydata";
import { useRouter } from "next/navigation";
import { City } from "country-state-city";
import { useEffect, useState } from "react";

const SearchForm3 = () => {
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const punjabCities = City.getCitiesOfState("PK", "PB"); // PK = Pakistan, PB = Punjab
    setCities(punjabCities);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (jobTitle.trim()) params.append("searchQuery", jobTitle);
    if (selectedCity) params.append("city", selectedCity);
    if (selectedCategory) params.append("industry", selectedCategory);

    router.push(`/job-list-v5?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Job Title Input */}
        <div className="form-group col-lg-4 col-md-12 col-sm-12">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            name="job_title"
            placeholder="Job title, keywords, or company"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* City Select */}
        <div className="form-group col-lg-3 col-md-12 col-sm-12 category">
          <span className="icon flaticon-map-locator"></span>
          <select
            className="chosen-single form-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="form-group col-lg-3 col-md-12 col-sm-12 category">
          <span className="icon flaticon-briefcase"></span>
          <select
            className="chosen-single form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
          <button type="submit" className="theme-btn btn-style-one">
            Find Jobs
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm3;
