import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolsSection from './components/ToolsSection';
import Footer from './components/Footer';
import ComingSoonModal from './components/ComingSoonModal';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Define backend base URL safely
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className="bg-white text-gray-900">
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Hero />
            <ToolsSection openModal={openModal} />
          </Route>
          <Route path="/login">
            <Login baseURL={baseURL} />
          </Route>
          <Route path="/signup">
            <Signup baseURL={baseURL} />
          </Route>
        </Switch>
        <Footer />
        {isModalOpen && <ComingSoonModal closeModal={closeModal} />}
      </div>
    </Router>
  );
}

export default App;
