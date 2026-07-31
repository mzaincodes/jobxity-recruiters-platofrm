"use client";

import { useEffect, useState } from "react";

const SearchBox = () => {
  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="Job title, keywords, or company"
      />
      <span className="icon flaticon-search-3"></span>
    </>
  );
};

export default SearchBox;
