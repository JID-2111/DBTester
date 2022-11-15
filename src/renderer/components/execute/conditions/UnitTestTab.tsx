import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import { useEffect, useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import useModal from 'renderer/hooks/useModal';
import AddUnitTestModal from './AddUnitTestModal';
import UnitTestList from './UnitTestList';

interface IUnitTestsProps {
  execution: ExecutionModelType;
  setExecution: (execution: ExecutionModelType) => void;
}

const UnitTestTab = ({ execution, setExecution }: IUnitTestsProps) => {
  const { isOpen, toggle } = useModal();

  const [conditionList, setConditionList] = useState<UnitTestType[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    let newList: UnitTestType[] = [];

    execution.rules.forEach((rule) => {
      newList = newList.concat(rule.unitTests);
    });

    setConditionList(newList);
    setRefresh(false);
  }, [execution, refresh]);

  const deleteCondition = (
    condition: Partial<UnitTestType>,
    rule: RuleModelType
  ) => {
    const foundRule = execution.rules.find((r) => r.id === rule.id);
    if (foundRule) {
      const newList = foundRule.unitTests.filter(
        (c: Partial<UnitTestType>) => c !== condition
      );

      foundRule.unitTests = newList;

      setExecution(execution);
      setRefresh(true);
    }
  };

  const addCondition = (condition: UnitTestType, rule: RuleModelType) => {
    const foundRule = execution.rules.find((r) => r.name === rule.name);
    if (foundRule) {
      const newList = foundRule.unitTests.concat(condition);
      foundRule.unitTests = newList;

      setExecution(execution);
      setRefresh(true);
    }
  };

  return (
    <Container>
      <Row className="p-0">
        <div className="d-flex p-0 align-items-center">
          <Button onClick={toggle} disabled={execution.rules.length === 0}>
            Add Unit Test
          </Button>
          <p className="count-label">
            Showing {conditionList.length} Unit Test(s)
          </p>
        </div>
      </Row>
      <hr />
      <Row>
        <UnitTestList
          conditionList={conditionList}
          deleteCondition={deleteCondition}
        />
      </Row>
      {isOpen && (
        <AddUnitTestModal
          isOpen={isOpen}
          toggle={toggle}
          execution={execution}
          addCondition={addCondition}
        />
      )}
    </Container>
  );
};

export default UnitTestTab;
