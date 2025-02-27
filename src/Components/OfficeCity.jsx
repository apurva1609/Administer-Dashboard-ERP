import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { AiFillDelete } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
// import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OfficeCity = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust as needed

  const [city_name, setCityName] = useState("");
  const [status, setStatus] = useState("active"); // Default status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [editingId, setEditingId] = useState(null); // Track which ID is being edited

  // Fetch data on component mount
  useEffect(() => {
    showUsers();
  }, []);

  // Fetch Data from API
  useEffect(() => {
    showUsers();
  }, []);

  const showUsers = () => {
    // setLoading(true);
    axios
      .get("http://localhost:8000/getdataOfficeCity")
      .then((res) => {
        setUserData(res.data.data);
        // setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // setLoading(false);
      });
  };

  // Handle Modal Close
  const handleClose = () => {
    setShow(false);
    setCityName("");
    setStatus("active");
    setEditingId(null); // Reset editing state
  };

  // const handleShow = () => setShow(true);

  // Add or Update City
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newData = { city_name, status };

    if (editingId) {
      // Update existing City
      axios
        .put(`http://localhost:8000/UpdateOfficeCity/${editingId}`, newData)
        .then(() => {
          alert("City Updated Successfully!");
          showUsers();
          handleClose();
        })
        .catch((err) => console.error(err))
        .finally(() => setIsSubmitting(false));
    } else {
      // Add new City
      axios
        .post("http://localhost:8000/addOfficeCity", newData)
        .then(() => {
          alert("City Added Successfully!");
          showUsers();
          handleClose();
        })
        .catch((err) => console.error(err))
        .finally(() => setIsSubmitting(false));
    }
  };

  // Delete City
  const deletedata = (_id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:8000/deleteOfficeCity/${_id}`)
        .then(() => {
          alert("City Deleted");
          showUsers();
        })
        .catch((err) => console.error(err));
    }
  };

  // Handle Edit Click
  const handleEdit = (item) => {
    setEditingId(item._id);
    setCityName(item.city_name);
    setStatus(item.status);
    setShow(true);
  };

  // Export to Excel
  const handleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      userData.map((a, index) => ({
        "Sr.No": index + 1,
        "City Name": a.city_name,
        Status: a.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "City Data");
    XLSX.writeFile(workbook, "City-data.xlsx");
  };

  // Export to PDF
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("City Data", 14, 22);
    doc.autoTable({
      head: [["Sr.No",  "City Name", "Status"]],
      body: userData.map((a, index) => [
        index + 1,
        a.city_name,
        a.status,
      ]),
      startY: 30,
    });
    doc.save("City-data.pdf");
  };

  // CSV data for export
  const csvData = userData.map((a, index) => ({
    "Sr.No": index + 1,
    "City Name": a.city_name,
    Status: a.status,
  }));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(userData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const showingFrom = indexOfFirstItem + 1;
  const showingTo = Math.min(indexOfLastItem, userData.length);
  const totalEntries = userData.length;

  // Handle search
  const handleSearch = () => {
    const filteredData = userData.filter(
      (item) =>
        item.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUserData(filteredData); // Update the table data
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Reset search when the input is cleared
  useEffect(() => {
    if (searchTerm === "") {
      showUsers(); // Reset the table data to the original data
    }
  }, [searchTerm]);

  return (
    <Container className="d-flex justify-content-end">
      <Row className="d-flex justify-content-center mt-5 pt-5">
        {/* Add City Button */}
        <Col md={12} className="d-flex justify-content-end mb-2">
          <Button variant="primary" onClick={handleShow}>
            Add City
          </Button>
        </Col>

        {/* Add City Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add City</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Label>City Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter City Name"
                    value={city_name}
                    onChange={(e) => setCityName(e.target.value)}
                    required
                  />
                </Col>
                <Col md={12} className="d-flex mt-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Active"
                    name="status"
                    value="active"
                    className="ps-5"
                    checked={status === "active"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Inactive"
                    name="status"
                    value="inactive"
                    className="ps-5"
                    checked={status === "inactive"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Export Buttons */}
        <Col md={8} className="">
          {/* <ButtonGroup aria-label="Export Buttons"> */}
          <CSVLink data={csvData} filename={"City-data.csv"} className="">
            <Button variant="primary">CSV</Button>
          </CSVLink>
          <Button variant="primary" onClick={handleExcel} className="ms-1">
            Excel
          </Button>
          <Button variant="primary" onClick={handlePdf} className="ms-1">
            PDF
          </Button>
          <Button
            variant="primary"
            onClick={() => window.print()}
            className="ms-1"
          >
            Print
          </Button>
          {/* </ButtonGroup> */}
        </Col>

        {/* Search Input */}
        <Col md={4} className="mb-3 d-flex">
          <Form.Label>Search:</Form.Label>
          <Form.Control
            type="text"
            placeholder
            value={searchTerm}
            className="ms-2"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            onChangeCapture={handleSearch}
          />
        </Col>

        {/* <Button variant="primary" onClick={handleSearch} className="ms-2">
              Search
            </Button> */}
        {/* Table */}
        <Col md={12} lg={12} lx={12} lxx={12} className="mt-3">
          <h1 className="fw-bold text-center text-primary">City Data</h1>
          {/* {loading ? (
            <p>Loading...</p>
          ) : ( */}
          <div style={{ overflowX: "auto" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>City Name</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((a, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{a.city_name}</td>
                    <td>{a.status}</td>
                    <td className="d-flex justify-content-evenly">
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(a)}
                      >
                        <GrEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deletedata(a._id)}
                      >
                        <AiFillDelete />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* )} */}
        </Col>

        {/* Pagination */}
        <Row>
          <Col md={6}>
            <div className="dataTables_info" aria-live="polite" role="status">
              Showing {showingFrom} to {showingTo} of {totalEntries} entries
            </div>
          </Col>

          <Col md={6} className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Pagination.Prev>
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Pagination.Next>
            </Pagination>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default OfficeCity;
