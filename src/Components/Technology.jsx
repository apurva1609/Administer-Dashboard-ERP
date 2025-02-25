import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button,  Col, Container, Form, Row, Table } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { AiFillDelete } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
import { useNavigate , useParams } from "react-router-dom";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Technology = () => {
  const [show, setShow] = useState(false);

     const navigate = useNavigate()
    const {_id} = useParams("");

    const handleShow = () => setShow(true);

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [name, setName] = useState("");
  const [status, setStatus] = useState("active"); // Default status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input value

  const handleClose = () => {
    if (  name || status !== "active") {
      if (window.confirm("Are you sure you want to discard changes?")) {
        setName("");
        setStatus("active");
        setShow(false);
      }
    } else {
      setShow(false);
    }
  };
  

  // Fetch data on component mount
  useEffect(() => {
    showUsers();
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/getupdateservices/${_id}`)
     .then(res =>{
        const data = res.data.userData
        console.log("link", res.data);

        setName(data.name || " ");
        setStatus(data.status || " ");
     }).catch(err =>{
        console.log(err);
     })
}, [_id])

       const handleUpdate = (e)=> {
        e.preventDefault()
    
        const userData={
          name,
          status,
        }
    
    axios.put(`http://localhost:8000/updateservices/${_id}`, userData)
      .then(res => {
        console.log("hi",res.data);
        // setUserData(res.data.userdata)
        alert('Data Add Successfully!');
        // navigate("/");
        setName("");
        setStatus("active");
        handleClose();
        showUsers(); // Refresh the table
      })
      .catch(err => {
        console.log(err);
      })
    }

  // Fetch data from the API
  const showUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/getdata")
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
      
      name,
      status,
    };

    axios
      .post("http://localhost:8000/technologypost", newData)
      .then((res) => {
        console.log("Data Added:", res.data);
        alert("Data Added Successfully!");
        setName("");
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
        .delete(`http://localhost:8000/deleteTechnology/${_id}`)
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
        "Technology Name": a.name,
        "Status": a.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Technology Data");
    XLSX.writeFile(workbook, "technology-data.xlsx");
  };

  // Export to PDF
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Technology Data", 14, 22);
    doc.autoTable({
      head: [["Sr.No", "Technology Name", "Status"]],
      body: userData.map((a, index) => [index + 1,  a.name, a.status]),
      startY: 30,
    });
    doc.save("technology-data.pdf");
  };

  // CSV data for export
  const csvData = userData.map((a, index) => ({
    "Sr.No": index + 1,
    "Technology Name": a.name,
    "Status": a.status,
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
      item.name.toLowerCase().includes(searchTerm.toLowerCase())||
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
            Add Technology
          </Button>
        </Col>

        {/* Add Technology Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Technology</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
               
                <Col md={12}>
                  <Form.Label>Technology Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Technology Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

        <Modal show={show} onHide={handleClose}>
          {/* <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header> */}
          <Modal.Body>
            <Form onSubmit={handleUpdate}>
              <Row>
               
                <Col md={12}>
                  <Form.Label>Technology Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Technology Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Footer> */}
        </Modal> 

        {/* Export Buttons */}
        <Col md={8} className="">
          {/* <ButtonGroup aria-label="Export Buttons"> */}
           
            <CSVLink data={csvData} filename={"technology-data.csv"} >
              <Button variant="primary" className="">CSV</Button>
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
        <Col md={4} className="mb-3 d-flex">
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
                    <th>Technology Name</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((a, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{a.name}</td>
                      <td>{a.status}</td>
                      <td className="d-flex justify-content-evenly">
                      <button className="btn btn-warning my-1 "
                        onClick={() => {
                          navigate(`/Head/${a._id}`)
                        }}
                      >
                        <GrEdit />
                      </button>
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
            >Previous</Pagination.Prev>
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
            >Next</Pagination.Next>
          </Pagination>
        </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Technology;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Button, Col, Container, Form, Row, Table, Modal } from "react-bootstrap";
// import Pagination from "react-bootstrap/Pagination";
// import { AiFillDelete } from "react-icons/ai";
// import { GrEdit } from "react-icons/gr";
// import { CSVLink } from "react-csv";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const Technology = () => {
//   const [show, setShow] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [userData, setUserData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [name, setName] = useState("");
//   const [status, setStatus] = useState("active");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     showUsers();
//   }, []);

//   const showUsers = () => {
//     setLoading(true);
//     axios.get("http://localhost:8000/getdata")
//       .then((res) => {
//         setUserData(res.data.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setLoading(false);
//         alert("Failed to fetch data.");
//       });
//   };

//   const handleClose = () => {
//     setShow(false);
//     setEditMode(false);
//     setEditId(null);
//     setName("");
//     setStatus("active");
//   };

//   const handleShow = () => setShow(true);

//   const handleEdit = (id) => {
//     const item = userData.find((u) => u._id === id);
//     if (item) {
//       setName(item.name);
//       setStatus(item.status);
//       setEditId(id);
//       setEditMode(true);
//       setShow(true);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const data = { name, status };

//     if (editMode) {
//       axios.put(`http://localhost:8000/updateservices/${editId}`, data)
//         .then(() => {
//           alert("Data Updated Successfully!");
//           handleClose();
//           showUsers();
//         })
//         .catch(() => alert("Failed to update data."))
//         .finally(() => setIsSubmitting(false));
//     } else {
//       axios.post("http://localhost:8000/technologypost", data)
//         .then(() => {
//           alert("Data Added Successfully!");
//           handleClose();
//           showUsers();
//         })
//         .catch(() => alert("Failed to add data."))
//         .finally(() => setIsSubmitting(false));
//     }
//   };

//   const deletedata = (id) => {
//     if (window.confirm("Are you sure?")) {
//       axios.delete(`http://localhost:8000/deleteTechnology/${id}`)
//         .then(() => {
//           alert("User Deleted");
//           showUsers();
//         })
//         .catch(() => alert("Failed to delete user."));
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Button variant="primary" onClick={handleShow}>Add Technology</Button>
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>{editMode ? "Edit" : "Add"} Technology</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group>
//               <Form.Label>Technology Name</Form.Label>
//               <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Status</Form.Label>
//               <Form.Check type="radio" label="Active" name="status" value="active" checked={status === "active"} onChange={(e) => setStatus(e.target.value)} />
//               <Form.Check type="radio" label="Inactive" name="status" value="inactive" checked={status === "inactive"} onChange={(e) => setStatus(e.target.value)} />
//             </Form.Group>
//             <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {loading ? <p>Loading...</p> : (
//         <Table striped bordered hover className="mt-3">
//           <thead>
//             <tr>
//               <th>Sr.No</th>
//               <th>Name</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {userData.map((a, index) => (
//               <tr key={a._id}>
//                 <td>{index + 1}</td>
//                 <td>{a.name}</td>
//                 <td>{a.status}</td>
//                 <td>
//                   <Button variant="warning" onClick={() => handleEdit(a._id)}><GrEdit /></Button>
//                   <Button variant="danger" onClick={() => deletedata(a._id)}><AiFillDelete /></Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default Technology;
