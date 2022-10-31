import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/App.scss';

import Execute from './components/execute/Execute';
import Home from './components/Home';
import NewConnections from './components/new_connections/NewConnections';
import RecentConnections from './components/recent_connections/RecentConnections';
import Results from './components/execute/Results';
import History from './components/history/History';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/execute" element={<Execute />} />
        <Route path="/newconnection" element={<NewConnections />} />
        <Route path="/RecentConnection" element={<RecentConnections />} />
        <Route path="/Results" element={<Results />} />
        <Route path="/History" element={<History />} />
      </Routes>
    </Router>
  );
}
