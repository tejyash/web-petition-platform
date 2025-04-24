import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PetitionerDashboard from './components/petitioner-dashboard';
import PetitionCommittee from './components/petitioner-commitee';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/petition" element={<PetitionerDashboard />} />
        <Route path="/petitioner/dashboard" element={<PetitionerDashboard />} />
        <Route path="/committee/dashboard" element={<PetitionCommittee />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);