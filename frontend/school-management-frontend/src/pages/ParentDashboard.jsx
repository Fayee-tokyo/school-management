import React from 'react';
const ParentDashboard =() =>{
    return(
        <div style ={{padding: '2rem'}}>
            <h1>Parent Dashboard</h1>
            <p>Welcome!Here you can monitor your child's progress,attendance and messages.</p>
            {/*Add parent-specific widgets,child overview,etc.*/ }
        </div>
    );
};

export default ParentDashboard;