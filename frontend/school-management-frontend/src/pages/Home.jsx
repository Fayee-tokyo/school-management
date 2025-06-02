const Home =() =>{
    return(
        <div style ={StyleSheet.container}>
            <h2>Welcome to the School Management System</h2>
            <p>Manage students,teachers,parents,classes and more with ease.</p>
            <img
            src="https://img.freepik.com/free-vector/school-children-classroom_1308-32678.jpg"
            alt="School"
            style={StyleSheet.image}
            />
        </div>
    );
};

// eslint-disable-next-line no-unused-vars
const styles={
    container:{
        textAlign:'center',
        marginTop:'2rem',
    },
    image:{
        maxWidth:'600px',
        width:'100%',
        marginTop:'1rem',
        borderRadius:'10px',
    },
};

export default Home;