/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useState } from 'react';

import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ProcedureParameter } from 'db/Procedures';
import { Condition, Parameter } from 'renderer/types';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import { OutputFormat, RecordMatches } from 'db/entity/enum';
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

  const handleInput = (inputValue: string, attribute: string) => {
    const p = parameterValues;
    p[attribute] = inputValue;
    setParameterValues(p);
  };

  const formatUnitTests = (rule: RuleModelType) => {
    const unitTests: UnitTestType[] = conditionList.map(
      (condition: Condition) => {
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
  const handleExecute = async () => {
    const execution: ExecutionModelType = {
      timestamp: new Date(),
      rules: [],
    };

    const rule: RuleModelType = {
      name: 'name',
      ruleId: 1,
      database: activeDb,
      testData: 'testdata',
      unitTests: [],
      execution,
      procedure: activeProcedure,
      parameters: Object.values(parameterValues),
    };

    const unitTests = formatUnitTests(rule);

    rule.unitTests = unitTests;
    execution.rules = [rule];

    const results = await window.executions.ipcRenderer.checkPassFail(
      execution
    );

    // display results here or route to other screen
    return results;
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="execute-wrapper">
        <h1>Execute Stored Procedures</h1>
        <Row>
          <Col md="4">
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
            <Row>
              {activeProcedure && (
                <ParameterContainer
                  activeParameters={activeParameters}
                  handleInput={handleInput}
                />
              )}
            </Row>
          </Col>
          <Col>
            <ConditionContainer
              conditionList={conditionList}
              setConditionList={setConditionList}
            />
          </Col>
        </Row>
        <div className="code-wrapper">
          <p className="procedure-code">{code}</p>
        </div>
        <div className="home-btn-footer">
          {activeProcedure && (
            <Button onClick={() => handleExecute()} className="home-btn">
              Execute Tests
            </Button>
          )}
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
