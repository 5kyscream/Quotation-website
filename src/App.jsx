import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PastProposals from './pages/PastProposals';
import ProposalForm from './pages/ProposalForm';
import ReviewExport from './pages/ReviewExport';
import ProposalView from './pages/ProposalView';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="proposals" element={<PastProposals />} />
            <Route path="proposals/:id" element={<ProposalView />} />
            <Route path="new" element={<ProposalForm />} />
            <Route path="review" element={<ReviewExport />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
