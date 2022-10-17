import { Condition } from 'renderer/types';
import SavedCondition from './SavedCondition';

import '../../../scss/Condition.scss';

interface IConditionListProps {
  conditionList: Condition[];
  setConditionList: (c: Condition[]) => void;
}
const ConditionList = ({
  conditionList,
  setConditionList,
}: IConditionListProps) => {
  const deleteCondition = (condition: Condition) => {
    const newList = conditionList.filter((c: Condition) => c !== condition);
    setConditionList(newList);
  };

  return (
    <div className="condition-list">
      {conditionList.map((condition: Condition) => {
        return (
          <SavedCondition
            operationType={condition.operationType}
            deleteCondition={deleteCondition}
            value={condition}
          />
        );
      })}
    </div>
  );
};

export default ConditionList;
