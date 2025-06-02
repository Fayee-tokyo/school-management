import { useState } from 'react';
import axios from 'axios';
import './Login.module.css'; //import the styles

const Login =() =>{
  const [formData,setFormData] =useState({ email:",password:"});

  const handleChange =e=>{
    setFormData({ ...formData,[e.target.name]: e.target.value});
  };
  
  const handleSubmit=async e=>{
    e.preventDefault();
    try{
      const response = await
      axios.post('http://localhost:5000/api/auth/login',formData);
      const{token} =response.data;
      //Store the JWT token in localStorage
      localStorage.setItem('token',token);

      console.log('Login successful:',response.data);
      //save token to localStorage or redirect

      //Optional:Redirect to a protected route (like dashboard)

      window.location.href='/dashboard';
    } catch (error){
      console.error('Login failed:',error.response?.data||error.message);
    }
  };
  return(
    <div className="login-container">
    <form on Submit ={handleSubmit}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
      <button type ="submit">Login</button>
    </form>
    </div>
  );
};
export default Login;

