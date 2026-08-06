import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PastProposals from './pages/PastProposals';
import ProposalForm from './pages/ProposalForm';
import PreviewExport from './pages/PreviewExport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="proposals" element={<PastProposals />} />
          <Route path="new" element={<ProposalForm />} />
          <Route path="preview" element={<PreviewExport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
