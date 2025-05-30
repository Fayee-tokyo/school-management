import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navigationbar from './components/Navigationbar';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register/>} />
        <Route path ="/login" element ={<Login />} />
         </Routes>
    </>
  );
}
export default App

