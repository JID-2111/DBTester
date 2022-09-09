import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './scss/App.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import Execute from 'renderer/components/Execute';
import Home from 'renderer/components/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/execute" element={<Execute />} />
      </Routes>
    </Router>
  );
}
