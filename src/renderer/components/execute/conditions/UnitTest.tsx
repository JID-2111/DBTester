import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import { Container, Row } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { getUnitTestDescription } from 'renderer/components/utils/helpers';

import '../../../scss/Condition.scss';

interface IConditionProps {
  condition: UnitTestType;
  deleteCondition: (condition: UnitTestType, rule: RuleModelType) => void;
}

const UnitTest = ({ condition, deleteCondition }: IConditionProps) => {
  // eslint-disable-next-line no-restricted-globals
  const { level, name, rule } = condition;

  const handleDelete = () => {
    if (!condition.rule) {
      return;
    }
    deleteCondition(condition, condition.rule);
  };
  return (
    <Container fluid className="rule-container">
      <Row>
        <div className="d-flex">
          <span>name: {name}</span>
          <button
            type="button"
            className="deleteButton edit-icons"
            onClick={handleDelete}
          >
            <Trash />
          </button>
        </div>
      </Row>
      <Row>
        <span>test type: {level}</span>
      </Row>
      <Row>
        <span>rule group: {rule.name}</span>
      </Row>
      <Row>
        <span>description: {getUnitTestDescription(condition)}</span>
      </Row>
    </Container>
  );
};

export default UnitTest;
