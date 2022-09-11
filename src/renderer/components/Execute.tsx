import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcedureDropdown from './ProcedureDropdown';

import '../scss/Execute.scss';

const Execute = () => (
  <div>
    <h1>Execute Stored Procedures</h1>
    <div className="execute-wrapper">
      <ProcedureDropdown />
    </div>
    <div className="execute-footer">
      <Link to="/">
        <Button className="home-button">Home</Button>
      </Link>
    </div>
  </div>
);

export default Execute;
