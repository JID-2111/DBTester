import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { Accordion, Container, Row } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Parameter } from '../ParameterContainer';

interface IRuleProps {
  rule: RuleModelType;
  execution: ExecutionModelType;
  setExecution: (execution: ExecutionModelType) => void;
  activeParameters: Parameter[];
}

const Rule = ({
  rule,
  execution,
  setExecution,
  activeParameters,
}: IRuleProps) => {
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
              {rule.unitTests.map((unitTest) => {
                return <span key={unitTest.name}>{unitTest.name}</span>;
              })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <Row>
        <span>procedure: {rule.procedure}</span>
      </Row>
      <Row>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>parameters</Accordion.Header>
            <Accordion.Body>
              {activeParameters.map((param, idx) => {
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
    </Container>
  );
};

export default Rule;
