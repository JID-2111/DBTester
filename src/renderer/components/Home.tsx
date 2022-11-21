import { Button, Col, Container } from 'react-bootstrap';
import { Archive, BarChartFill, Link45deg, Plus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import RecentList from './recent_connections/Recent';

import '../scss/Home.scss';

const Home = () => {
  return (
    <Container fluid className="home-wrapper">
      <Col className="sidebar">
        <RecentList />
      </Col>
      <Col className="launch-wrapper">
        <BarChartFill className="logo" height="5em" width="5em" />
        <h1>Welcome to DB Tester</h1>
        <Link to="/newconnection">
          <Button variant="link" className="launch-button">
            <Plus className="icon" height="2em" width="2em" />
            <h4>New Connection</h4>
          </Button>
        </Link>
        <Link to="/RecentConnection">
          <Button variant="link" className="launch-button">
            <Link45deg className="icon" height="2em" width="2em" />
            <h4>Connect to Existing</h4>
          </Button>
        </Link>
        <Link to="/History">
          <Button variant="link" className="launch-button">
            <Archive className="icon" height="2em" width="2em" />
            <h4>View History</h4>
          </Button>
        </Link>
      </Col>
    </Container>
  );
};

export default Home;
