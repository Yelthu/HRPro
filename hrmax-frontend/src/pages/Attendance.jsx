// src/App.js
import React from 'react';
import FileUpload from '../components/FileUpload';


const Attendance = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1 className="text-2xl font-bold mb-4">Please Upload Attendance CSV File Here!</h1> */}
        
        <FileUpload />
      </header>
    </div>
  );
};

export default Attendance;
