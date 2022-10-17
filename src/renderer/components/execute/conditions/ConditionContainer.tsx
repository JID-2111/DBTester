import { TestLevel } from 'db/entity/enum';
import { Col } from 'react-bootstrap';
import { Condition } from 'renderer/types';
import ConditionForm from './ConditionForm';
import ConditionList from './ConditionList';

interface IConditionContainerProps {
  conditionList: Condition[];
  setConditionList: (c: Condition[]) => void;
}

const ConditionContainer = ({
  conditionList,
  setConditionList,
}: IConditionContainerProps) => {
  const addCondition = (condition: Condition) => {
    setConditionList(conditionList.concat(condition));
  };

  return (
    <Col className="condition-box">
      <h4>Add Test Conditions</h4>
      <ConditionForm
        operationType={TestLevel.COL}
        addCondition={addCondition}
      />
      <ConditionForm
        operationType={TestLevel.TABLE}
        addCondition={addCondition}
      />
      <ConditionList
        conditionList={conditionList}
        setConditionList={setConditionList}
      />
    </Col>
  );
};

export default ConditionContainer;
