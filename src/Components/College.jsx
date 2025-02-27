import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { AiFillDelete } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const College = () => {
  
   const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust as needed

  const [university_name, setUniversityName] = useState("");
  const [college_name, setCollegeName] = useState("");
  const [city_name, setCityName] = useState("");
  const [status, setStatus] = useState("active"); // Default status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [editingId, setEditingId] = useState(null); // Track which ID is being edited
  const [categories, setCategories] = useState([]);
  // const [categoriesdata, setCategoriesData] = useState([]);
  // const [categoryData, setCategoryData] = useState([]);
  // const [category, setCategory] = useState([]);


  // Fetch Data from API
  useEffect(() => {
    showUsers();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/getdataUniversity")
      .then((res) => {
        // setCategoriesData(res.data.data);
        setCategories(res.data.data);  // Assuming the response contains a `data` array
        // setCategory(res.data.data);
        console.log("Categories fetched:", res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/getdataCity")
      .then((res) => {
        setCategories(res.data.data); // Assuming the response contains a `data` array
        // setCategoryData(res.data.data);
        console.log("Categories fetched:", res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const showUsers = () => {
    // setLoading(true);
    axios
      .get("http://localhost:8000/getdataCollege")
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
  setUniversityName("");
  setCollegeName("");
  setCityName("");
  setStatus("active");
  setEditingId(null); // Reset editing state
  
};


// Add or Update Technology
const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const newData = { university_name, college_name, city_name, status };

  if (editingId) {
    // Update existing technology
    axios
      .put(`http://localhost:8000/UpdateCollege/${editingId}`, newData)
      .then(() => {
        alert("Technology Updated Successfully!");
        showUsers();
        handleClose();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSubmitting(false));
  } else {
    // Add new technology
    axios
      .post("http://localhost:8000/addCollege", newData)
      .then(() => {
        alert("Technology Added Successfully!");
        showUsers();
        handleClose();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSubmitting(false));
  }
};

  // Delete data
  const deletedata = (_id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:8000/deleteCollege/${_id}`)
        .then(() => {
          alert("Technology Deleted");
          showUsers();
        })
        .catch((err) => console.error(err));
    }
  };


  const handleEdit = (item) => {
    setEditingId(item._id);
    setUniversityName(item.university_name);
    setCollegeName(item.college_name);
    setCityName(item.city_name);
    setStatus(item.status);
    setShow(true);
  };

  // Export to Excel
  const handleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      userData.map((a, index) => ({
        "Sr.No": index + 1,
        "University Name": a.university_name,
        "College Name": a.college_name,
        "City Name": a.city_name,
        Status: a.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "College Data");
    XLSX.writeFile(workbook, "College-data.xlsx");
  };

  // Export to PDF
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("College Data", 14, 22);
    doc.autoTable({
      head: [["Sr.No", "University Name", "College Name", "City Name", "Status"]],
      body: userData.map((a, index) => [
        index + 1,
        a.university_name,
        a.college_name,
        a.city_name,
        a.status,
      ]),
      startY: 30,
    });
    doc.save("College-data.pdf");
  };

  // CSV data for export
  const csvData = userData.map((a, index) => ({
    "Sr.No": index + 1,
    "University Name": a.university_name,
    "College Name": a.college_name,
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
  // const handleSearch = () => {
  //   const filteredData = userData.filter(
  //     (item) =>
  //       item.university_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.status.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setUserData(filteredData); // Update the table data
  // };

  const handleSearch = () => {
  const filteredData = userData.filter((item) => {
    const universityName = item.university_name?.toLowerCase() || "";
    const collegeName = item.college_name?.toLowerCase() || "";
    const cityName = item.city_name?.toLowerCase() || "";
    const statusValue = item.status?.toLowerCase() || "";

    return (
      universityName.includes(searchTerm.toLowerCase()) ||
      collegeName.includes(searchTerm.toLowerCase()) ||
      cityName.includes(searchTerm.toLowerCase()) ||
      statusValue.includes(searchTerm.toLowerCase())
    );
  });

  setUserData(filteredData);
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
        {/* Add College Button */}
        <Col md={12} className="d-flex justify-content-end mb-2">
          <Button variant="primary" onClick={handleShow}>
            Add College
          </Button>
        </Col>

        {/* Add College Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add College</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  {/* <Form.Label>University Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter University ID"
                    value={university_name}
                    onChange={(e) => setUniversityName(e.target.value)}
                    required
                  /> */}
                  <Form.Label className="mt-3">
                      <b>Select university</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="Select university"
                      value={university_name}
                      onChange={(e) => setUniversityName(e.target.value)}
                      required
                    >
                      <option value="">Choose a university</option>
                      {categories.map((university) => (
                        <option key={university._id} value={university.university_name}>
                          {university.university_name}
                        </option>
                      ))}
                    </Form.Select>
                </Col>
                
                <Col md={12} className="mt-2">
                  <Form.Label>College Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter University Name"
                    value={college_name}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                  />
                </Col>
                <Col md={12} className="mt-2">
                  <Form.Label className="mt-3">
                      <b>Select city</b>
                    </Form.Label>
                    <Form.Select
                      aria-label="Select city"
                      value={city_name}
                      onChange={(e) => setCityName(e.target.value)}
                      required
                    >
                      <option value="">Choose a city</option>
                      {categories.map((city) => (
                        <option key={city._id} value={city.city_name}>
                          {city.city_name}
                        </option>
                      ))}
                    </Form.Select>
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
          <CSVLink
            data={csvData}
            filename={"College-data.csv"}
            className="ms-1"
          >
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

        {/* Table */}
        <Col md={12} lg={12} lx={12} lxx={12} className="mt-3">
          <h1 className="text-center text-primary fw-bold">College Data</h1>
          <div style={{ overflowX: "auto" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>University Name</th>
                  <th>College Name</th>
                  <th>City Name</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
              {/* {userData.length > 0 ? (
                currentItems.map((product, index) => {
                  const matchedCategory = categoryData.find((cat) => cat._id === product.city_name);
                  const matched = category.find((cat) => cat._id === product.university_name);
                  return (
                    
                  <tr key={product._id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{matched ? matched.university_name : "No Category"}</td>
                    <td>{product.college_name}</td>
                    <td>{matchedCategory ? matchedCategory.city_name : "No Category"}</td>
                    <td>{product.status}</td>
                    <td className="d-flex justify-content-evenly">
                      <Button variant="warning" onClick={() => handleEdit(product)}>
                        <GrEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deletedata(product._id)}
                      >
                        <AiFillDelete />
                      </Button>
                    </td>
                  </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No products found.
                    </td>
                  </tr>
                )} */}
{currentItems.map((product, index) => {
  return (
<tr key={product._id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{product.university_name} </td>
                    <td>{product.college_name}</td>
                    <td>{product.city_name} </td>
                    <td>{product.status}</td>
                    <td className="d-flex justify-content-evenly">
                      <Button variant="warning" onClick={() => handleEdit(product)}>
                        <GrEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deletedata(product._id)}
                      >
                        <AiFillDelete />
                      </Button>
                    </td>
                  </tr>
                  )
                })
}
              </tbody>
            </Table>
          </div>
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

export default College;
