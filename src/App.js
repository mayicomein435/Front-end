import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';  // Import the Tasks component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} /> {/* Define the tasks route */}
      </Routes>
    </Router>
  );
};

export default App;
