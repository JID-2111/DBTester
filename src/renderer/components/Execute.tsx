import { useState } from 'react';

import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcedureDropdown from './ProcedureDropdown';

import '../scss/Execute.scss';

const Execute = () => {
  const [code, setCode] = useState<string>('');

  const handleClick = async () => {
    await window.connections.ipcRenderer.disconnect();
  };

  return (
    <div>
      <h1>Execute Stored Procedures</h1>
      <ProcedureDropdown setCode={setCode} />
      <div className="execute-wrapper">
        <p className="procedure-code">{code}</p>
      </div>
      <div className="home-btn-footer">
        <Link to="/">
          <Button className="home-button">Home</Button>
          <Button onClick={() => handleClick()} className="disconnect-button">
            Disconnect
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Execute;
