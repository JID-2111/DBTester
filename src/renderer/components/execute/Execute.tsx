/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useState } from 'react';

import { Button, Col, Row, Modal, Container, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProcedureParameter } from 'db/Procedures';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import { OutputFormat, RecordMatches } from 'db/entity/enum';
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
    name: 'default',
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
  const [conditionList, setConditionList] = useState<Partial<UnitTestType>[]>(
    []
  );
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

  const formatUnitTests = (rule: RuleModelType) => {
    const unitTests: UnitTestType[] = conditionList.map(
      (condition: Partial<UnitTestType>) => {
        const unitTest: UnitTestType = {
          level: condition.level!,
          name: 'test',
          expectedRecordMatches: RecordMatches.GREATER_THAN,
          total: condition.total || false,
          expectedNumRecords: condition.expectedNumRecords || 0,
          table: condition.table!,
          column: condition.column! || 'column',
          value: condition.value! || 'value',
          operation: condition.operation!,
          result: false,
          format: OutputFormat.JSON,
          output: '',
          rule,
        };
        return unitTest;
      }
    );
    return unitTests;
  };

  const addRule = (rule: Partial<RuleModelType>) => {
    const newRule: RuleModelType = {
      name: rule.name || 'name',
      database: activeDb,
      procedure: activeProcedure,
      testData: 'testdata',
      ruleId:
        execution.rules.length > 0
          ? execution.rules[execution.rules.length - 1].ruleId + 1
          : 0,
      unitTests: [],
      execution,
      parameters: rule.parameters || [],
    };

    setExecution({
      ...execution,
      rules: [...execution.rules, newRule],
    });
  };

  const deleteRule = (rule: RuleModelType) => {
    setExecution({
      ...execution,
      rules: execution.rules.filter((r) => r !== rule),
    });
  };

  const handleExecute = async (execName: string) => {
    const newExecution = {
      name: execName,
      timestamp: new Date(),
      rules: execution.rules,
    };

    const rule: RuleModelType = {
      name: 'name',
      ruleId: 1,
      database: activeDb,
      testData: 'testdata',
      unitTests: [],
      execution,
      procedure: activeProcedure,
      parameters: [],
    };

    const unitTests = formatUnitTests(rule);

    rule.unitTests = unitTests;
    newExecution.rules.push(rule);

    const results = await window.executions.ipcRenderer.checkPassFail(
      newExecution
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
        {activeProcedure && <ExecuteCell handleExecute={handleExecute} />}
      </Col>
      <Col className="content-area">
        <Tabs
          defaultActiveKey="rule-groups"
          activeKey={key}
          onSelect={(k) => setKey(k!)}
        >
          <Tab eventKey="rule-groups" title="Rule Groups">
            <RuleGroupTab
              addRule={addRule}
              deleteRule={deleteRule}
              rules={execution ? execution.rules : []}
              activeParameters={activeParameters}
              activeProcedure={activeProcedure}
            />
          </Tab>
          <Tab eventKey="unit-tests" title="Unit Tests">
            <UnitTestTab
              conditionList={conditionList}
              setConditionList={setConditionList}
            />
          </Tab>
          <Tab eventKey="results" title="Results">
            <Results results={execution!} />
          </Tab>
        </Tabs>
      </Col>
      {alert && showAlert()}
    </Container>
  );
};

export default Execute;
