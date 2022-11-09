import { RuleModelType } from 'db/models/RuleModel';
import { Container } from 'react-bootstrap';
import { Parameter } from '../ParameterContainer';
import Rule from './Rule';

interface IRuleGroupListProps {
  rules: RuleModelType[];
  deleteRule: (r: RuleModelType) => void;
  activeParameters: Parameter[];
}

const RuleGroupList = ({
  rules,
  deleteRule,
  activeParameters,
}: IRuleGroupListProps) => {
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
              deleteRule={deleteRule}
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
