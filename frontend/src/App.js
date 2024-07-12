import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import User from './components/User';
import EmployeesVacations from './components/EmployeesVacations';
import AddVacation from './components/AddVacation';
import EditVacation from './components/EditVacation';
import EditEmployee from './components/EditEmployee';
import AddEmployee from './components/AddEmployee';
import VacationShow from './components/VacationShow';
import './App.css';

const App = () => {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrUser({ token });
    }
  }, []);

  return (
    <div className="App">
      <Router>
        {currUser ? (
          <>
            <Navbar currUser={currUser} setCurrUser={setCurrUser} />
            <Routes>
              <Route path="/" element={<EmployeesVacations />} />
              <Route path="/add-vacation" element={<AddVacation />} />
              <Route path="/edit-vacation/:employeeId/:vacationId" element={<EditVacation />} />
              <Route path="/edit-employee/:employeeId" element={<EditEmployee/>} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/employees/:employeeId/vacations/:vacationId" element={<VacationShow />} />
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
