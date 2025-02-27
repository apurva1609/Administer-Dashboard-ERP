import { useState } from "react";
import { Button, Col, Nav, Row } from "react-bootstrap";
// import Image from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaAddressBook, FaAddressCard, FaUserTie } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";
import { MdFormatAlignJustify, MdMiscellaneousServices, MdProductionQuantityLimits, MdSpaceDashboard } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoPersonAddSharp } from "react-icons/io5";
import { TfiLayoutAccordionMerged, TfiLayoutAccordionSeparated } from "react-icons/tfi";
import { IoMdContacts } from "react-icons/io";
import { GrServices } from "react-icons/gr";
// import image from "../Assets/Images/Group 6.png";

const Sidebar = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <>
      <style>
        {`
          .sidebar{
          position: fixed;
          background-color:rgb(86, 133, 141);
          // background-color:rgb(232, 233, 233);
        //   background-color:rgb(252, 214, 233);
          height: 100%;
          width: 250px;
          // z-index: 1045;
          overflow-y:auto;
          overflow-x:hidden;
          }

          .link{
          color: black;
          font-size: 20px;
          }

           .link:hover{
          color: #007bff; 
          // color:rgb(53, 151, 255); 
        //   background-color:rgb(250, 250, 250); 
         background-color:rgb(140, 175, 212);
        //   background-color:rgb(204, 229, 255); 
          }
        
         .links {
           background-color: rgb(232, 233, 233);
           overflow-y:auto;
          overflow-x:hidden;
         }
        `}
      </style>

      <Button
        variant="dark"
        className="d-md-none"
        onClick={handleShow}
        style={{ position: "fixed", top: "8px",  zIndex: "1050" }}
      >
        ☰
      </Button>
      <div className="sidebar d-none d-md-block" >
        <Row>
          <Col className="" >
            <br />
            <br />
            <br/>
            {/* <Image src={image} style={{height:"100px"}} className=" w-100 mt-2"/> */}
            <Nav defaultActiveKey="/User"  className="flex-column link-unstyled">
              <Link
                to="/Head/dashboard"
                className="text-decoration-none link ps-3 py-2"
              >
                <MdSpaceDashboard  size={25} className="me-2"/> Dashboard
              </Link>

              <Link
                to="/Head/technology"
                className="text-decoration-none link ps-3 py-2"
              >
                <FaAddressCard size={25}className="me-2"/> Technology
              </Link>
              <Link
                to="/Head/university"
                className="text-decoration-none link ps-3 py-2"
              >
                <FaUserTie   size={25}className="me-2"/> University
              </Link>
              <Link
                to="/Head/college"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> College
              </Link>

              <Link
                to="/Head/city"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> City
              </Link>
              <Link
                to="/Head/education"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> Education
              </Link>
              <Link
                to="/Head/officecity"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> Office City
              </Link>
              <Link
                to="/Head/office"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> Office
              </Link>
              <Link
                to="/Head/Courses"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> Courses
              </Link>
              <Link
                to="/Head/GuestLecturer"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> Guest Lecturer
              </Link>

             
              <Link to="/" className="text-decoration-none link ps-3 py-2">
                <LuLogIn size={25} className="me-2"/> Logout
              </Link>
            </Nav>
          </Col>
        </Row>
      </div>

      <div>
       <Offcanvas  show={show} onHide={handleClose}   className="d-md-none links bg-white">
        <Offcanvas.Header closeButton  className="links">
        <div
              className="mt-3 mb-4"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
          <Offcanvas.Title>
          <h4 className="px-4 py-3 text-secondary">Sumago Infotech</h4>
          </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="links">
          <div className="sidebar d-block d-md-none links">
            <br />
            <br />
            <Nav defaultActiveKey="/User"  className="flex-column link-unstyled">
              <Link
                to="/Head/dashboard"
                className="text-decoration-none link ps-3 py-2"
              >
                <MdSpaceDashboard  size={25} className="me-2"/> Dashboard
              </Link>

              {/* <Link
                to="/Head/Sing_form"
                className="text-decoration-none link ps-3 py-2"
              >
                <FaFileSignature size={25}className="me-2"/> Sing Users
              </Link> */}

              <Link
                to="/Head/Add_registration"
                className="text-decoration-none link ps-3 py-2"
              >
                <FaAddressCard size={25}className="me-2"/> Add Users
              </Link>
              <Link
                to="/Head/Add_contact_user"
                className="text-decoration-none link ps-3 py-2"
              >
                <FaUserTie   size={25}className="me-2"/> User Contact
              </Link>
              <Link
                to="/Head/User"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoPersonAddSharp  size={25}className="me-2"/> Registred Users
              </Link>

              <Link
                to="/Head/Add_pricing"
                className="text-decoration-none link ps-3 py-2"
              >
                <FaAddressBook  size={25} className="me-2"/> Addpricing
              </Link>
              <Link
                to="/Head/Pricing"
                className="text-decoration-none link ps-3 py-2"
              >
                <MdFormatAlignJustify size={25} className="me-2"/> Pricing
              </Link>
              <Link
                to="/Head/Add_Accordion"
                className="text-decoration-none link ps-3 py-2"
              >
                <TfiLayoutAccordionMerged size={25} className="me-2"/> Add Accordion
              </Link>
              <Link
                to="/Head/Accordions"
                className="text-decoration-none link ps-3 py-2"
              >
                <TfiLayoutAccordionSeparated  size={25} className="me-2"/> Accordions
              </Link>
              <Link
                to="/Head/Add_Service"
                className="text-decoration-none link ps-3 py-2"
              >
                <GrServices  size={25} className="me-2"/> Add Service
              </Link>
              <Link
                to="/Head/Services"
                className="text-decoration-none link ps-3 py-2"
              >
                <MdMiscellaneousServices  size={25} className="me-2"/> Services
              </Link>
              <Link
                to="/Head/Add_Contact"
                className="text-decoration-none link ps-3 py-2"
              >
                <IoMdContacts  size={25} className="me-2"/> Add Contact
              </Link>
              <Link
                to="/Head/Product"
                className="text-decoration-none link ps-3 py-2"
              >
                <AiFillProduct  size={25} className="me-2"/> Product
              </Link>
              <Link
                to="/Head/Add_product"
                className="text-decoration-none link ps-3 py-2"
              >
                <MdProductionQuantityLimits   size={25} className="me-2"/> Add Product
              </Link>
              <Link to="/" className="text-decoration-none link ps-3 py-2">
                <LuLogIn size={25} className="me-2"/> Logout
              </Link>
            </Nav>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
             
      </div>
    </>
  );
};

export default Sidebar;
