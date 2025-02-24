import React from 'react'
import {  Container, Form, Nav, Navbar, Image } from 'react-bootstrap';
import { AiOutlineLogout } from 'react-icons/ai';
import { TbBellRingingFilled } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import image1 from "../Assets/Images/SUMAGO Logo.png";

// style={{ backgroundColor:"rgb(12, 36, 100)"}}

const Home = () => {
  return (
    <>
      <Navbar expand="lg" className="" fixed='top' style={{ backgroundColor:"rgb(6, 22, 66)"}}>
      <Container fluid>
        {/* <Navbar.Brand href="#" className='text-white fw-bold fs-2 ps-5 ' >Products</Navbar.Brand> */}
        <Image src={image1}  className=" w-25 h-25"/>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {/* <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Link</Nav.Link>
             */}
          </Nav>
          <Form className="d-flex">
          <Link  className="text-decoration-none ps-3 py-2">
          <TbBellRingingFilled size={29} className="me-3 text-white"/>
          </Link>

          <Link to='/' className="text-decoration-none ps-3 py-2">
          <AiOutlineLogout  size={29} className="me-5 text-white"/> 
              </Link>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default Home;
