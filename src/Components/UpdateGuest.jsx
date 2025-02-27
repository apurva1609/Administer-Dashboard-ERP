import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, CardBody } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateGuest = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  console.log(_id);
  const [guest_lecturer_name, setguest_lecturer_name] = useState("");
  const [lecture_topic_description, setlecture_topic_description] = useState("");
  const [guest_lecture_batch, setguest_lecture_batch] = useState("");
  const [guest_lecture_date, setguest_lecture_date] = useState("");
  const [status, setStatus] = useState("active"); // Default status

// Format date to yyyy-MM-dd
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for months
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  return `${year}-${month}-${day}`;
};
  //  Fetch user data
  useEffect(() => {
    axios.get(`http://localhost:8000/getguestbyId/${_id}`)
      .then(res => {
        console.log("Fetched Data:", res.data);
        const data = res.data.data;

        // Populate state with fetched data
        setguest_lecturer_name(data.guest_lecturer_name || "");
        setlecture_topic_description(data.lecture_topic_description || "");
        setguest_lecture_batch(data.guest_lecture_batch || "");
        setguest_lecture_date(formatDate(data.guest_lecture_date || ""));
      

      })
      .catch(error => {
        console.log(error);
      });

  }, [_id]); // Dependency array ensures this runs only when `_id` changes


  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      guest_lecturer_name,
      lecture_topic_description,
      guest_lecture_batch,
      guest_lecture_date,
      status

    };

    axios.put(`http://localhost:8000/Updateguest/${_id}`, userData)
      // {
      //     headers: {
      //         Authorization: `Bearer ${localStorage.getItem('token')}` // Add Authorization header
      //     }
      // }


      .then((res) => {

        console.log(res.data);
        alert("Data updated successfully");
        navigate("/GuestLecturer");
        // setExpense("");
        // setAmount("");
        // setDate("");

      })
      .catch((error) => {
        console.error("Error updating :", error);
      });
  };
  console.log("Rendering UpdateGuest");
  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center view-container">
        <Col md={8}>
          <Card className="my-4 shadow">
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <h1>Update Guest</h1>
                <Row>
                  <Col md={12}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter  Name"
                      value={guest_lecturer_name}
                      onChange={(e) => setguest_lecturer_name(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Lecture Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter lecture description"
                      value={lecture_topic_description}
                      onChange={(e) => setlecture_topic_description(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Lecture Batch</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter lecture batch"
                      value={guest_lecture_batch}
                      onChange={(e) => setguest_lecture_batch(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Lecture Date</Form.Label>
                    <Form.Control
                      type="Date"
                      placeholder="Enter lecture date"
                      value={guest_lecture_date}
                      onChange={(e) => setguest_lecture_date(e.target.value)}
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
                  </Col></Row>

                <Button className="align-items-center align-center w-25  border-2 rounded-5 fs-4 mt-4" variant="success" type="submit">
                  Submit
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateGuest;
