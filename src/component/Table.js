import React from "react";
import axios from "axios";
import "./Table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { useEffect } from "react";
import Edit from "./Edit";
import Search from "./Search";

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateState, setUpdateState] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);

  //   Search functionality
  const filteredRecords = tableData.filter((record) => {
    const searchRegex = new RegExp(searchQuery, "i");
    return (
      searchRegex.test(record.name) ||
      searchRegex.test(record.email) ||
      searchRegex.test(record.role)
    );
  });

  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredRecords.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(filteredRecords.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  const goFirstPage = () => {
    setCurrentPage(1);
  };

  const goPreviousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCurrentPage = (id) => {
    setCurrentPage(id);
  };

  const goNextPage = () => {
    if (currentPage !== nPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goLastPage = () => {
    setCurrentPage(nPage);
  };

  // delete manually
  const handleDeleteManually = (recordId) => {
    const updatedData = tableData.filter((data) => data.id !== recordId);
    setTableData(updatedData);
  };

  // delete selected functionality
  const handleCheckboxChange = (recordId) => {
    if (selectedRecords.includes(recordId)) {
      setSelectedRecords(selectedRecords.filter((id) => id !== recordId));
    } else {
      setSelectedRecords([...selectedRecords, recordId]);
    }
  };

  const handleDelete = () => {
    const updatedData = [...tableData];
    selectedRecords.forEach((recordId) => {
      const index = updatedData.findIndex((record) => record.id === recordId);
      if (index !== -1) {
        updatedData.splice(index, 1);
      }
    });
    setTableData(updatedData);
    setSelectedRecords([]);
  };

  // delete all funcionality
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allRecordIds = records.map((record) => record.id);
      setSelectedRecords(allRecordIds);
    } else {
      setSelectedRecords([]);
    }
  };

  const handleEdit = (id) => {
    setUpdateState(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUpdateState(-1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setTableData(response.data);
      } catch (error) {
        console.log("Error in fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="table-responsive">
      <div className="mt-5 mb-3">
        <Search onSearch={handleSearch} />
      </div>
      <form onSubmit={handleSubmit}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <input
                  className="form-check-input hoverPointer border border-dark mx-4 mt-2"
                  type="checkbox"
                  value=""
                  checked={selectedRecords.length === records.length}
                  onChange={handleSelectAll}
                  id="flexCheckDefault"
                />
              </th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) =>
              updateState === item.id ? (
                <Edit
                  item={item}
                  tableData={tableData}
                  setTableData={setTableData}
                />
              ) : (
                <tr
                  key={item.id}
                  className={
                    selectedRecords.includes(item.id) ? "table-active" : ""
                  }
                >
                  <th scope="row">
                    <input
                      className="form-check-input hoverPointer border border-dark mx-4 mt-2"
                      type="checkbox"
                      value=""
                      checked={selectedRecords.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      id="flexCheckDefault"
                    />
                  </th>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    <div className="d-flex">
                      <FontAwesomeIcon
                        className="hoverPointer"
                        icon={faPenToSquare}
                        onClick={() => {
                          handleEdit(item.id);
                        }}
                      />
                      <FontAwesomeIcon
                        className="mx-4 hoverPointer"
                        onClick={() => handleDeleteManually(item.id)}
                        icon={faTrash}
                        style={{ color: " #d70932" }}
                      />
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <nav className="stylePagination">
          <div className="styleButton mx-4">
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={selectedRecords.length <= 0 ? true : false}
            >
              Delete Selected
              <span className="badge text-bg-warning ms-2">
                {selectedRecords.length}
              </span>
            </button>
          </div>
          <ul className="pagination">
            <li className="page-item mx-2 stylePaginationItem">
              <button className="page-link" onClick={goFirstPage}>
                {"<<"}
              </button>
            </li>
            <li className="page-item mx-2 stylePaginationItem">
              <button className="page-link" onClick={goPreviousPage}>
                {"<"}
              </button>
            </li>
            {numbers.map((number, index) => (
              <li
                className={`page-item mx-2 stylePaginationItem ${
                  currentPage === number ? "active" : ""
                }`}
                key={index}
              >
                <button
                  className="page-link"
                  onClick={() => {
                    changeCurrentPage(number);
                  }}
                >
                  {number}
                </button>
              </li>
            ))}
            <li className="page-item mx-2 stylePaginationItem">
              <button className="page-link" onClick={goNextPage}>
                {">"}
              </button>
            </li>
            <li className="page-item mx-2 stylePaginationItem">
              <button className="page-link" onClick={goLastPage}>
                {">>"}
              </button>
            </li>
          </ul>
        </nav>
      </form>
    </div>
  );
};

export default Table;
