import { useState } from 'react';

import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ProcedureParameter } from 'db/Procedures';
import { Condition, Parameter } from 'renderer/types';
import ProcedureDropdown from './ProcedureDropdown';

import '../../scss/Execute.scss';
import DBDropdown from './DBDropdown';
import ConditionContainer from './conditions/ConditionContainer';
import ParameterContainer from './ParameterContainer';

const Execute = () => {
  const [code, setCode] = useState<string>('');
  const [activeDb, setActiveDb] = useState<string>('React');
  const [activeProcedure, setActiveProcedure] = useState<string>('');
  const [activeParameters, setActiveParameters] = useState<
    ProcedureParameter[]
  >([]);
  const [parameterValues, setParameterValues] = useState<Parameter>({});
  const [conditionList, setConditionList] = useState<Condition[]>([]);

  const updateDb = (database: string) => {
    setActiveDb(database);
    setActiveProcedure('');
    setCode('');
  };

  const handleClick = async () => {
    await window.connections.ipcRenderer.disconnect();
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    attribute: string
  ) => {
    const p = parameterValues;
    p[attribute] = e.currentTarget.value;
    setParameterValues(p);
    console.log(parameterValues);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="execute-wrapper">
        <h1>Execute Stored Procedures</h1>
        <Container>
          <Row>
            <Col>
              <Row>
                <h6>Selected Database</h6>
                <DBDropdown activeDb={activeDb} updateDb={updateDb} />
              </Row>
              <Row>
                <h6>Selected Procedure</h6>
                <ProcedureDropdown
                  activeDb={activeDb}
                  activeProcedure={activeProcedure}
                  setParameterValues={setParameterValues}
                  setActiveProcedure={setActiveProcedure}
                  setActiveParameters={setActiveParameters}
                  setCode={setCode}
                />
              </Row>
            </Col>
            <ConditionContainer
              conditionList={conditionList}
              setConditionList={setConditionList}
            />
            <Row>
              <ParameterContainer
                activeParameters={activeParameters}
                handleInput={handleInput}
              />
            </Row>
          </Row>
        </Container>
        <div className="code-wrapper">
          <p className="procedure-code">{code}</p>
        </div>
        <div className="home-btn-footer">
          <Link to="/">
            <Button onClick={() => handleClick()} className="home-btn">
              Disconnect
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Execute;
