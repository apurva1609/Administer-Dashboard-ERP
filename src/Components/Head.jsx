// import React from "react";
// import Sidebar from "./Sidebar";
// import { Route, Routes } from "react-router-dom";
// import { Container } from "react-bootstrap";
// import Home from "./Home";
// import Technology from "./Technology";

// const Head = () => {
//   return (
//     <>
//       <div className="d-flex">
//         <div className="">
//           <Sidebar />
//         </div>
//         <div  className="content-container flex-grow-1" >
//           <Home  fixed="top"/>
//           <Container >
//             <Routes>
//               <Route path="/technology" element={<Technology/>}/>
//             </Routes>
//           </Container>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Head;

import React from "react";
import Sidebar from "./Sidebar";
// import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./Home";
import Technology from "./Technology";
import University from "./University";
import College from "./College";
import City from "./City";

const Head = () => {
  return (
    <>
      <Home />
      <div className="d-flex">
        <div>
          <Sidebar />
        </div>
        <div className="content-container flex-grow-1" style={{ marginLeft: "250px", padding: "20px" }}>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/university" element={<University />} />
              <Route path="/college" element={<College />} />
              <Route path="/city" element={<City />} />
            </Routes>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Head;
