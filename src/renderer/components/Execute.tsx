import { useState } from 'react';

import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcedureDropdown from './ProcedureDropdown';

import '../scss/Execute.scss';
import DBDropdown from './DBDropdown';

const Execute = () => {
  const [code, setCode] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
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

  const showAlert = () => {
    return (
      <Modal show={alert} onHide={() => setAlert(false)} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Procedure Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="code-wrapper">{code}</Modal.Body>
      </Modal>
    );
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
          <Button onClick={() => setAlert(true)}>code</Button>
        </div>
        <div> </div>
        <div className="home-btn-footer">
          <Link to="/">
            <Button onClick={() => handleClick()} className="home-btn">
              Disconnect
            </Button>
          </Link>
        </div>
        {alert && showAlert()}
      </div>
    </div>
  );
};

export default Execute;
