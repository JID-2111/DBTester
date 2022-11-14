/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useState } from 'react';

import { Button, Col, Row, Modal, Container, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProcedureParameter } from 'db/Procedures';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { ConnectionModelType } from 'db/models/ConnectionModels';
import ProcedureDropdown from './ProcedureDropdown';

import '../../scss/Execute.scss';
import '../../scss/Home.scss';
import DBDropdown from './DBDropdown';
import { formatConnectionString } from '../utils/helpers';
import UnitTestTab from './conditions/UnitTestTab';
import Results from './Results';
import ExecuteCell from './ExecuteCell';
import RuleGroupTab from './rules/RuleGroupTab';

const Execute = () => {
  const defaultExecutionModel: ExecutionModelType = {
    name: '',
    timestamp: new Date(),
    rules: [],
  };

  const [code, setCode] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [activeDb, setActiveDb] = useState<string>('React');
  const [activeProcedure, setActiveProcedure] = useState<string>('');
  const [activeParameters, setActiveParameters] = useState<
    ProcedureParameter[]
  >([]);
  const [connection, setConnection] = useState<ConnectionModelType | undefined>(
    undefined
  );
  const [execution, setExecution] = useState<ExecutionModelType>(
    defaultExecutionModel
  );
  const [key, setKey] = useState<string>('rule-groups');

  const navigate = useNavigate();

  useEffect(() => {
    const getConnection = async () => {
      const conn = await window.connections.ipcRenderer.fetch();
      setConnection(conn[0]);
    };
    getConnection();
  }, []);

  const updateDb = (database: string) => {
    setActiveDb(database);
    setActiveProcedure('');
    setCode('');
  };

  const handleClick = async () => {
    await window.connections.ipcRenderer.disconnect();
    navigate('/');
  };

  const handleExecute = async () => {
    const results = await window.executions.ipcRenderer.checkPassFail(
      execution
    );

    // set tab to results
    setKey('results');
    setExecution(results);
  };

  const showAlert = () => {
    return (
      <Modal
        show={alert}
        onHide={() => setAlert(false)}
        size="xl"
        scrollable
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Procedure Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="code-wrapper procedure-code">{code}</Modal.Body>
      </Modal>
    );
  };

  return (
    <Container fluid className="execute-wrapper">
      <Col className="sidebar">
        <Row className="recent-item">
          {connection && (
            <>
              <span>{connection.nickname}</span>
              <span className="recent-item-info">
                {formatConnectionString(connection)}
              </span>
            </>
          )}
        </Row>
        <hr />
        <Row className="justify-content-center">
          <p>Databases</p>
          <div className="d-flex">
            <p className="side-label">Selected: </p>
            <DBDropdown activeDb={activeDb} updateDb={updateDb} />
          </div>
          <Button onClick={() => handleClick()} className="disconnect-btn">
            Disconnect
          </Button>
        </Row>
        <hr />
        <Row>
          <p>Stored Procedures</p>
          <div className="d-flex">
            <p className="side-label">Selected: </p>
            <ProcedureDropdown
              activeDb={activeDb}
              activeProcedure={activeProcedure}
              setActiveProcedure={setActiveProcedure}
              setActiveParameters={setActiveParameters}
              setCode={setCode}
            />
          </div>
          {code !== '' && (
            <Button
              variant="link"
              size="sm"
              className="code-button"
              onClick={() => setAlert(!!code)}
            >
              code
            </Button>
          )}
        </Row>
        <hr />
        {activeProcedure && (
          <ExecuteCell
            handleExecute={handleExecute}
            execution={execution}
            setExecution={setExecution}
          />
        )}
      </Col>
      <Col className="content-area">
        <Tabs
          defaultActiveKey="rule-groups"
          activeKey={key}
          onSelect={(k) => setKey(k!)}
        >
          <Tab eventKey="rule-groups" title="Rule Groups">
            <RuleGroupTab
              activeParameters={activeParameters}
              activeProcedure={activeProcedure}
              execution={execution}
              setExecution={setExecution}
            />
          </Tab>
          <Tab eventKey="unit-tests" title="Unit Tests">
            <UnitTestTab execution={execution} setExecution={setExecution} />
          </Tab>
          <Tab eventKey="results" title="Results">
            <Results results={execution} />
          </Tab>
        </Tabs>
      </Col>
      {alert && showAlert()}
    </Container>
  );
};

export default Execute;
