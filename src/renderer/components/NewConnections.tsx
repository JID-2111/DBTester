import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NewConnectionForm from './NewConnectionForm';

import '../scss/NewConnection.scss';

const NewConnections = () => {
  return (
    <>
      <h1> Create New Connection</h1>
      <NewConnectionForm />
      <div className="home-btn-footer">
        <Link to="/">
          <Button className="home-btn">Home</Button>
        </Link>
      </div>
    </>
  );
};

export default NewConnections;
