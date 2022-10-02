import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NewConnectionForm from './NewConnectionForm';

import '../scss/NewConnection.scss';

const NewConnections = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="new-conn-wrapper">
        <h1 className="new-conn-header"> Create New Connection</h1>
        <NewConnectionForm />
        <div className="home-btn-footer">
          <Link to="/">
            <Button className="home-btn">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewConnections;
