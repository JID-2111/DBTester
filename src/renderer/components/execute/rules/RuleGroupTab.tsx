import { ExecutionModelType } from 'db/models/ExecutionModel';
import { ProcedureParameter } from 'db/Procedures';
import { Button, Container, Row } from 'react-bootstrap';
import useModal from 'renderer/hooks/useModal';
import AddRuleGroupModal from './AddRuleGroupModal';
import RuleGroupList from './RuleGroupList';

interface IRuleGroupsProps {
  activeParameters: ProcedureParameter[];
  activeProcedure: string;
  execution: ExecutionModelType;
  setExecution: (execution: ExecutionModelType) => void;
}

const RuleGroupTab = ({
  activeParameters,
  activeProcedure,
  execution,
  setExecution,
}: IRuleGroupsProps) => {
  const { isOpen, toggle } = useModal();

  const { rules } = execution;

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
          execution={execution}
          setExecution={setExecution}
          activeParameters={activeParameters}
        />
      </Row>
      {isOpen && (
        <AddRuleGroupModal
          isOpen={isOpen}
          toggle={toggle}
          activeProcedure={activeProcedure}
          activeParameters={activeParameters}
          execution={execution}
          setExecution={setExecution}
        />
      )}
    </Container>
  );
};

export default RuleGroupTab;
