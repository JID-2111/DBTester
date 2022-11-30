import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { ProcedureParameter } from 'db/Procedures';
import { useEffect, useState } from 'react';
import { Accordion, Container, Row } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import {
  formatCleanupTables,
  getUnitTestDescription,
} from 'renderer/components/utils/helpers';

interface IRuleProps {
  rule: RuleModelType;
  execution: ExecutionModelType;
  setExecution: (execution: ExecutionModelType) => void;
}

const Rule = ({ rule, execution, setExecution }: IRuleProps) => {
  const [procParameters, setProcParameters] = useState<ProcedureParameter[]>();

  useEffect(() => {
    const fetchParams = async () => {
      const params = await window.procedures.ipcRenderer.getProcedureParameters(
        execution.procedure
      );
      setProcParameters(params);
    };
    fetchParams();
  }, [execution]);

  const deleteRule = async (ruleToDelete: RuleModelType) => {
    setExecution({
      ...execution,
      rules: execution.rules.filter((r) => r !== ruleToDelete),
    });
  };

  return (
    <Container fluid className="rule-container">
      <Row>
        <div className="d-flex">
          <span>name: {rule.name}</span>
          <button
            type="button"
            className="deleteButton edit-icons"
            onClick={() => deleteRule(rule)}
          >
            <Trash />
          </button>
        </div>
      </Row>
      <Row>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>unit tests</Accordion.Header>
            <Accordion.Body>
              <Row>
                {rule.unitTests.map((unitTest, idx) => {
                  return (
                    <span key={unitTest.name}>
                      {idx + 1}. {unitTest.name}:{' '}
                      {getUnitTestDescription(unitTest)}{' '}
                    </span>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <Row>
        <span>procedure: {execution.procedure}</span>
      </Row>
      <Row>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>parameters</Accordion.Header>
            <Accordion.Body>
              {procParameters &&
                procParameters.map((param, idx) => {
                  return (
                    <Row key={param.name}>
                      <span>
                        {param.name} ({param.type}): {rule.parameters[idx]}
                      </span>
                    </Row>
                  );
                })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <Row>
        <span>data table: {rule.testData}</span>
      </Row>
      <Row>
        <span>cleanup tables: {formatCleanupTables(rule)}</span>
      </Row>
    </Container>
  );
};

export default Rule;
