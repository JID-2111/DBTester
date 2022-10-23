import { useState } from 'react';

import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcedureDropdown from './ProcedureDropdown';

import '../../scss/Execute.scss';
import DBDropdown from './DBDropdown';

const Execute = () => {
  const [code, setCode] = useState<string>('');
  const [activeDb, setActiveDb] = useState<string>('React');
  const [activeProcedure, setActiveProcedure] = useState<string>('');

  const updateDb = (database: string) => {
    setActiveDb(database);
    setActiveProcedure('');
    setCode('');
  };

  const handleClick = async () => {
    await window.connections.ipcRenderer.disconnect();
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="execute-wrapper">
        <h1>Execute Stored Procedures</h1>
        <div>
          <h6>Selected Database</h6>
          <DBDropdown activeDb={activeDb} updateDb={updateDb} />
        </div>
        <div>
          <h6>Selected Procedure</h6>
          <ProcedureDropdown
            activeDb={activeDb}
            activeProcedure={activeProcedure}
            setActiveProcedure={setActiveProcedure}
            setCode={setCode}
          />
        </div>
        <div className="code-wrapper">
          <p className="procedure-code">{code}</p>
        </div>
        <div className="home-btn-footer">
          <Link to="/">
            <Button onClick={() => handleClick()} className="home-btn">
              Disconnect
            </Button>
          </Link>
          <Link to="/Results">
            <Button>Execute</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Execute;
