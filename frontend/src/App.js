import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import User from './components/User';
import Dashboard from './components/Dashboard';
import EditVacation from './components/EditVacation';
import VacationShow from './components/VacationShow';
import MyVacations from './components/MyVacations';
import './App.css';
import EmployeeVacations from './components/EmployeeVacations';
import RequestVacation from './components/RequestVacation';
import ManageRequests from './components/ManageRequests';

const App = () => {
  const [currUser, setCurrUser] = useState(null);

  return (
    <div className="App">
      <Router>
        {currUser ? (
          <>
            <Navbar currUser={currUser} setCurrUser={setCurrUser} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/request-vacation" element={<RequestVacation />} />
              <Route path="/edit-vacation/:userId/:vacationId" element={<EditVacation />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees-vacations" element={<EmployeeVacations />} />
              <Route path="/manage-requests" element={<ManageRequests />} />
              <Route path="/my-vacations" element={<MyVacations />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/users/:userId/vacations/:vacationId" element={<VacationShow />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<User setCurrUser={setCurrUser} currUser={currUser} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
};

export default App;
