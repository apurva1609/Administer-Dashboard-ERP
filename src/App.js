import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Head from './Components/Head';
import UpdateGuest from './Components/UpdateGuest';
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Head/*' element={<Head/>}/>
        <Route path="/UpdateGuest/:_id" element={<UpdateGuest />} />
      </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;
