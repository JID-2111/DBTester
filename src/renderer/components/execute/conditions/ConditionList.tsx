import { UnitTestType } from 'db/models/UnitTestModels';
import SavedCondition from './SavedCondition';

import '../../../scss/Condition.scss';

interface IConditionListProps {
  conditionList: Partial<UnitTestType>[];
  setConditionList: (c: Partial<UnitTestType>[]) => void;
}
const ConditionList = ({
  conditionList,
  setConditionList,
}: IConditionListProps) => {
  const deleteCondition = (condition: Partial<UnitTestType>) => {
    const newList = conditionList.filter(
      (c: Partial<UnitTestType>) => c !== condition
    );
    setConditionList(newList);
  };

  return (
    <div className="condition-list">
      {conditionList.map((condition: Partial<UnitTestType>, idx: number) => {
        const key = `cond - ${idx}`;
        return (
          <SavedCondition
            deleteCondition={deleteCondition}
            condition={condition}
            key={key}
          />
        );
      })}
    </div>
  );
};

export default ConditionList;
