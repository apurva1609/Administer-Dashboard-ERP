import React from 'react'
import { Container, Row, Col, Card, Form, Button} from "react-bootstrap";

const Login = () => {
  return (
    <>
      <Container className="d-flex justify-content-center">
          <Col md={10}>
          <div className="border-top border-5 mt-5 border-primary"></div>
            <Card className="">
              <Card.Body>
                <h1 className="text-center text-dark pt-3">SIGN IN</h1>
                <p className="pb-3">Please enter your details to join us ! </p>
                <Row>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="text" placeholder="Enter Email" required />
                <Form.Label className='pt-3' >Password</Form.Label>
                    <Form.Control type="text" placeholder="Password" required/>
                </Row>
                
                  
                <Button href='/Head' className="w-100 mt-3"  >Submit</Button>
              </Card.Body>
            </Card>
          </Col>
        
      </Container>
    </>
  )
}

export default Login;
