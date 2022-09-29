import { Button } from 'react-bootstrap';
import { Archive, Link45deg, Plus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import RecentList from './Recent';

import '../scss/Home.scss';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to DB Tester</h1>
      <div className="menu-wrapper">
        <div className="recent-wrapper">
          <RecentList />
        </div>
        <div className="launch-wrapper">
          <Link to="/">
            <Button variant="secondary" className="launch-button">
              <Plus className="icon" height="2em" width="2em" />
              <h2>New Connection</h2>
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" className="launch-button">
              <Link45deg className="icon" height="2em" width="2em" />
              <h2>Connect to Existing</h2>
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" className="launch-button">
              <Archive className="icon" height="2em" width="2em" />
              <h2>View History</h2>
            </Button>
          </Link>
        </div>
      </div>
      <Link to="/execute">
        <Button className="execute-button">Execute</Button>
      </Link>
    </div>
  );
};

export default Home;
