import React, { useState } from "react";
import "./Search.css";

const Search = (props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    props.onSearch(event.target.value);
  };
  return (
    <div className="styleSearch">
      <input
        placeholder="Search by name, email or role"
        className="form-control"
        type="text"
        style={{ width: "90vw" }}
        name="search"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Search;
