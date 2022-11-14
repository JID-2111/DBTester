import { ExecutionModelType } from 'db/models/ExecutionModel';
import { Container } from 'react-bootstrap';
import { Parameter } from '../ParameterContainer';
import Rule from './Rule';

interface IRuleGroupListProps {
  execution: ExecutionModelType;
  setExecution: (execution: ExecutionModelType) => void;
  activeParameters: Parameter[];
}

const RuleGroupList = ({
  execution,
  setExecution,
  activeParameters,
}: IRuleGroupListProps) => {
  const { rules } = execution;
  return (
    <Container
      fluid
      className={`p-0 justify-content-center ${
        rules.length === 0 ? 'd-flex' : ''
      }`}
    >
      {rules.length > 0 ? (
        rules.map((rule) => {
          return (
            <Rule
              key={rule.name}
              rule={rule}
              execution={execution}
              setExecution={setExecution}
              activeParameters={activeParameters}
            />
          );
        })
      ) : (
        <span>No Rule Groups Yet!</span>
      )}
    </Container>
  );
};

export default RuleGroupList;
