import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Leave from './pages/Leave'
import Attendance from './pages/Attendance'
import Appraisal from './pages/Appraisal'
import Login from './pages/Login';
import LeaveRequestList from './components/LeaveRequestList';
import Register from './pages/Register';
import Signin from './pages/Signin';
import ForgotPassword from './pages/ForgotPassword';
import AboutUsNew from './pages/AboutUsNew'
import Hoco from './components/Hoco';
import Service from './components/Service';
import Telecom from './components/Telecom';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import { AuthContext } from './context/AuthContext';
import Logout from './pages/Logout';
import UserManagement from './components/UserManagement';
import Scheduling from './pages/Scheduling';
import Home from './pages/Home';

function App() {

  const ProtectedRoutes = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user.IsAdmin) {
      return <Navigate to='/' />
    }
    return children
  }

  return (
    <Router>
      <div className='App'>
        <Navbar />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/AboutUsNew" element={<AboutUsNew />} />
          <Route path="/logout" element={<Logout />} />
          <Route path='/Home' element={<Home />} />

          <Route path="/attendance"
            element={
              <ProtectedRoutes>
                <Attendance />
              </ProtectedRoutes>
            }
          />


          <Route path="/leave" element={<Leave />} />
          <Route path="/appraisal" element={<Appraisal />} />

          <Route path="/leaveapproval" element={<ApprovalWorkflow />} />

          <Route path="/usermanagement" element={<UserManagement />} />

          <Route path="/leaverequestlist" element={<LeaveRequestList />} />
          <Route path="/scheduling" element={<Scheduling />} />

          <Route path="/register" element={<Register />} />

          <Route path="/hoco" element={<Hoco />} />
          <Route path="/service" element={<Service />} />
          <Route path="/telecom" element={<Telecom />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
