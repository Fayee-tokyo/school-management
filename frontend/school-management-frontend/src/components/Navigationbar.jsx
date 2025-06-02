import { Link } from 'react-router-dom';
const Navigationbar=()=>{
  return(
    <nav style={styles.nav}>
      <h1 style={styles.logo}>SCHOOL MANAGEMENT SYSTEM</h1>
      <div style={styles.links}>
        <Link to ="/"style ={styles.link}>Home</Link>
        <Link to ="/login"style={styles.link}>Login</Link>
        <Link to="/register"style={styles.link}>Register</Link>
        <Link to ="/about"style={styles.link}>About</Link>
       </div>
    </nav>
  );
};

const styles={
  nav:{
    background:'#2c3e50',
    color:'white',
    display:'flex',
    justifyContent:'space-between',
    padding:'1rem 2rem',
    alignItems:'center',
  },
  logo:{
    margin:0,
  },
  links:{
    display:'flex',
    gap:'1rem',
  },
  link:{
    color:'white',
    textDecoration:'none',
    fontWeight:'bold',
  },
};

export default Navigationbar;

