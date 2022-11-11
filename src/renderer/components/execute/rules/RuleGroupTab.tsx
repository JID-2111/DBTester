import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import { ProcedureParameter } from 'db/Procedures';
import { Button, Container, Row } from 'react-bootstrap';
import useModal from 'renderer/hooks/useModal';
import AddRuleGroupModal from './AddRuleGroupModal';
import RuleGroupList from './RuleGroupList';

interface IRuleGroupsProps {
  rules: RuleModelType[];
  addRule: (r: Partial<RuleModelType>) => void;
  deleteRule: (r: RuleModelType) => void;
  activeParameters: ProcedureParameter[];
  activeProcedure: string;
  conditionList: Partial<UnitTestType>[];
}

const RuleGroupTab = ({
  rules,
  addRule,
  deleteRule,
  activeParameters,
  activeProcedure,
  conditionList,
}: IRuleGroupsProps) => {
  const { isOpen, toggle } = useModal();

  return (
    <Container>
      <Row className="p-0">
        <div className="d-flex p-0 align-items-center">
          <Button disabled={!activeProcedure} onClick={toggle}>
            Add Rule Group
          </Button>
          <p className="count-label">Showing {rules.length} Rule(s)</p>
        </div>
      </Row>
      <hr />
      <Row>
        <RuleGroupList
          rules={rules}
          deleteRule={deleteRule}
          activeParameters={activeParameters}
        />
      </Row>
      {isOpen && (
        <AddRuleGroupModal
          isOpen={isOpen}
          toggle={toggle}
          addRule={addRule}
          activeProcedure={activeProcedure}
          activeParameters={activeParameters}
        />
      )}
    </Container>
  );
};

export default RuleGroupTab;
