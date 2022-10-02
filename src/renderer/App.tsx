import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/App.scss';

import Execute from './components/Execute';
import Home from './components/Home';
import NewConnections from './components/NewConnections';
import RecentConnections from './components/RecentConnections';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/execute" element={<Execute />} />
        <Route path="/newconnection" element={<NewConnections />} />
        <Route path="/RecentConnection" element={<RecentConnections />} />
      </Routes>
    </Router>
  );
}
