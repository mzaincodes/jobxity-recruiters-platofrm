import {
  banks,
  currencies,
  educationLevel,
  experienceOptions,
  industries,
  jobTypes,
  jobMode,
  noticePeriods,
  statuses,
} from "@/data/mydata";

// Function to get label by value
export const getIndustryLabel = (value) => {
  const industryValue = typeof value === "string" ? parseInt(value, 10) : value;
  const industry = industries.find(
    (industry) => industry.value === industryValue
  );
  return industry ? industry.label : "Industry not found";
};

export const getJobTypeLabel = (value) => {
  // Ensure value is an integer
  const jobTypeValue = typeof value === "string" ? parseInt(value, 10) : value;

  // Find the job type from the jobTypes array
  const jobType = jobTypes.find((type) => type.value === jobTypeValue);

  // Return the label if found, otherwise return a fallback message
  return jobType ? jobType.label : "Job type not found";
};

export const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
};

export const timeAgo = (timestamp) => {
  const now = new Date();
  const timeDiff = now - new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate month length (30 days)
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
};

export const getExperienceLabel = (value) => {
  // Find the option that matches the value and return its label
  const option = experienceOptions.find(
    (option) => option.value === parseInt(value)
  );
  return option ? option.label : "Enter exp"; // Return the label or "Enter exp" if not found
};

export const getEducationLabel = (value) => {
  // Find the option that matches the value and return its label
  const option = educationLevel.find(
    (option) => option.value === parseInt(value)
  );
  return option ? option.label : "Enter Education Level"; // Return the label or a default message if not found
};

export const getBankLabel = (value) => {
  // Find the option that matches the value and return its label
  const option = banks.find((option) => option.value === parseInt(value));
  return option ? option.label : "Select a Bank"; // Return the label or a default message if not found
};

export const getCurrencyLabel = (value) => {
  // Find the option that matches the value and return its label
  const option = currencies.find((option) => option.value === value);
  return option ? option.label : "Select a Currency"; // Return the label or a default message if not found
};

export const getJobModeLabel = (value) => {
  const option = jobMode.find((option) => option.value === Number(value));
  return option ? option.label : "N/A";
};


export const getStatusLabel = (value) => {
  // Find the option that matches the value and return its label
  const option = statuses.find((option) => option.value === value);
  return option ? option.label : "Unknown Status"; // Return the label or a default message if not found
};

export const getNoticePeriodLabel = (value) => {
  // Ensure value is an integer
  const noticePeriodValue =
    typeof value === "string" ? parseInt(value, 10) : value;

  // Find the notice period from the noticePeriods array
  const noticePeriod = noticePeriods.find(
    (period) => period.value === noticePeriodValue
  );

  // Return the label if found, otherwise return a fallback message
  return noticePeriod ? noticePeriod.label : "Notice period not found";
};

export const getEducationLevelLabel = (value) => {
  // Ensure value is an integer
  const educationLevelValue =
    typeof value === "string" ? parseInt(value, 10) : value;

  // Find the education level from the educationLevel array
  const education = educationLevel.find(
    (level) => level.value === educationLevelValue
  );

  // Return the label if found, otherwise return a fallback message
  return education ? education.label : "Education level not found";
};




export const formatSalary = (salary) => {
  if (!salary) return ''; // If no salary, return an empty string
  
  if (salary >= 1000000) {
    return `${Intl.NumberFormat().format(Math.round(salary / 1000000))}M`; // For values >= 1,000,000, use 'M' for million
  }

  if (salary >= 1000) {
    return `${Intl.NumberFormat().format(Math.round(salary / 1000))}k`; // For values >= 1,000, use 'k' for thousand
  }

  return Intl.NumberFormat().format(salary); // If less than 1,000, format normally
};

export const formatApplicationId =  (id) => {
  return id?.toString().padStart(6, '0');
}

export const getCurrencySymbol = (value) => {
  const option = currencies.find((option) => option.value === value);
  return option ? option.symbol : "";
};
