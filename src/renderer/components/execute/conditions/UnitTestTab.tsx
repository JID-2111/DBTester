import { UnitTestType } from 'db/models/UnitTestModels';
import { Button, Container, Row } from 'react-bootstrap';
import useModal from 'renderer/hooks/useModal';
import AddUnitTestModal from './AddUnitTestModal';
import UnitTestList from './UnitTestList';

interface IUnitTestsProps {
  conditionList: Partial<UnitTestType>[];
  setConditionList: (c: Partial<UnitTestType>[]) => void;
}

const UnitTestTab = ({ conditionList, setConditionList }: IUnitTestsProps) => {
  const { isOpen, toggle } = useModal();

  const deleteCondition = (condition: Partial<UnitTestType>) => {
    const newList = conditionList.filter(
      (c: Partial<UnitTestType>) => c !== condition
    );
    setConditionList(newList);
  };

  const addCondition = (condition: Partial<UnitTestType>) => {
    setConditionList(conditionList.concat(condition));
  };

  return (
    <Container>
      <Row className="p-0">
        <div className="d-flex p-0 align-items-center">
          <Button onClick={toggle}>Add Unit Test</Button>
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
          addCondition={addCondition}
        />
      )}
    </Container>
  );
};

export default UnitTestTab;
