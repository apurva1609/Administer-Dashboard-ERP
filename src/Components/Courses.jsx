import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button,  Col, Container, Form, Row, Table } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { AiFillDelete } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Courses = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    if ( course_name || status !== "active") {
      if (window.confirm("Are you sure you want to discard changes?")) {
        setCourse_Name("");
        setCourse_Description("");
        setCourse_Duration("");
        setCourse_Fees("");
        setStatus("active");
        setShow(false);
      }
    } else {
      setShow(false);
    }
  };
  const handleShow = () => setShow(true);

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust as needed
  const navigate = useNavigate();

  const [course_name, setCourse_Name] = useState("");
  const [course_description, setCourse_Description] = useState("");
  const [course_duration, setCourse_Duration] = useState("");
  const [course_fees, setCourse_Fees] = useState("");
  const [status, setStatus] = useState("active"); // Default status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input value

  // Fetch data on component mount
  useEffect(() => {
    showUsers();
  }, []);

  // Fetch data from the API
  const showUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/getdataCourse")
      .then((res) => {
        setUserData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("Failed to fetch data. Please check your network connection or try again later.");
      });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newData = {
      
        course_name,
        course_description,
        course_duration,
        course_fees,
         status
    };

    axios
      .post("http://localhost:8000/addCourse", newData)
      .then((res) => {
        console.log("Data Added:", res.data);
        alert("Data Added Successfully!");
        setCourse_Name("");
        setCourse_Description("");
        setCourse_Duration("");
        setCourse_Fees("");
        setStatus("active");
        handleClose();
        showUsers(); // Refresh the table
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to add data. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Delete data
  const deletedata = (_id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:8000/deleteCourse/${_id}`)
        .then((res) => {
          console.log("User Deleted:", res.data);
          alert("User Deleted");
          showUsers();
        })
        .catch((error) => {
          console.error("Error Deleting User:", error);
          alert("Failed to delete user. Please check your network connection or try again.");
        });
    }
  };

  

  // Export to Excel
  const handleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      userData.map((a, index) => ({
        "Sr.No": index + 1,
        "Course Name": a.course_name,
        "Course Description":a.course_description,
        "Course Duration":a.course_duration,
        "Course Fees":a.course_fees,
        "Status": a.status
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses Data");
    XLSX.writeFile(workbook, "courses-data.xlsx");
  };

  // Export to PDF
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Courses Data", 14, 22);
    doc.autoTable({
      head: [["Sr.No", "Technology ID", "Course Name","Course Description","Course Duration","Course Fees", "Status"]],
      body: userData.map((a, index) => [index + 1, a.course_name,
        a.course_description,
        a.course_duration,
        a.course_fees, 
        a.status]),
      startY: 30,
    });
    doc.save("Courses-data.pdf");
  };

  // CSV data for export
  const csvData = userData.map((a, index) => ({
    "Sr.No": index + 1,
    "Course Name": a.course_name,
    "Course Description":a.course_description,
    "Course Duration":a.course_duration,
    "Course Fees":a.course_fees,
    "Status": a.status
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
    const filteredData = userData.filter((item) =>
      item.university_name.toLowerCase().includes(searchTerm.toLowerCase())||
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
        {/* Add Technology Button */}
        <Col md={12} className="d-flex justify-content-end mb-2">
          <Button variant="primary" onClick={handleShow}>
            Add Courses
          </Button>
        </Col>

        {/* Add Technology Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course Name"
                    value={course_name}
                    onChange={(e) => setCourse_Name(e.target.value)}
                    required
                  />
                </Col>
                <Col md={12}>
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course description"
                    value={course_description}
                    onChange={(e) => setCourse_Description(e.target.value)}
                    required
                  />
                </Col>
                <Col md={12}>
                  <Form.Label>Course Duration</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course duration"
                    value={course_duration}
                    onChange={(e) => setCourse_Duration(e.target.value)}
                    required
                  />
                </Col>
                <Col md={12}>
                  <Form.Label>Course Fees</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course fees"
                    value={course_fees}
                    onChange={(e) => setCourse_Fees(e.target.value)}
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
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Export Buttons */}
        <Col md={6} className="">
          {/* <ButtonGroup aria-label="Export Buttons"> */}
            <CSVLink data={csvData} filename={"course-data.csv"} className="">
              <Button variant="primary">CSV</Button>
            </CSVLink>
            <Button variant="primary" onClick={handleExcel} className="ms-1">
              Excel
            </Button>
            <Button variant="primary" onClick={handlePdf} className="ms-1">
              PDF
            </Button>
            <Button variant="primary" onClick={() => window.print()} className="ms-1">
              Print
            </Button>
          {/* </ButtonGroup> */}
        </Col>

        {/* Search Input */}
        <Col md={6} className="mb-3 d-flex">
          <Form.Label>Search:</Form.Label>
          {/* <div className="d-flex"> */}
            <Form.Control
              type="text"
              placeholder
              value={searchTerm}
              className="ms-2"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              onChangeCapture={handleSearch}
            />
           
          {/* </div> */}
        </Col>
 {/* <Button variant="primary" onClick={handleSearch} className="ms-2">
              Search
            </Button> */}
        {/* Table */}
        <Col md={12} lg={12} lx={12} lxx={12} className="mt-3">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Sr.No</th>
                    <th>Course Name</th>
                    <th>Course Description</th>
                    <th>Course Duration</th>
                    <th>Course Fees</th>
                    
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((a, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{a.course_name}</td>
                      <td>{a.course_description}</td>
                      <td>{a.course_duration}</td>
                      <td>{a.course_fees}</td>
                      <td>{a.status}</td>
                      <td className="d-flex justify-content-evenly">
                        <Button
                          variant="warning"
                          onClick={() => navigate(`/Head/Update_pricing/${a.id}`)}
                        >
                          <GrEdit />
                        </Button>
                        <Button variant="danger" onClick={() => deletedata(a._id)}>
                          <AiFillDelete />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
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
            />
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
            />
          </Pagination>
        </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Courses;