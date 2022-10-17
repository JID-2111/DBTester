import { TestLevel } from 'db/entity/enum';
import { Trash } from 'react-bootstrap-icons';
import { Condition } from 'renderer/types';

import '../../../scss/Condition.scss';

interface IConditionProps {
  operationType: TestLevel;
  value: Condition;
  deleteCondition: (c: Condition) => void;
}

const SavedCondition = ({
  operationType,
  value,
  deleteCondition,
}: IConditionProps) => {
  const opString = Object.keys(TestLevel).filter((key) => Number.isNaN(key))[
    operationType
  ];

  return (
    <div className="condition-item">
      <p>{opString}</p>
      <p>{value.testItem}</p>
      <p>{value.condition.toUpperCase()}</p>
      {value.compare !== '' && <p>{value.compare}</p>}
      {value.value !== '' && <p>&quot;{value.value}&quot;</p>}
      <button
        type="button"
        className="deleteButton"
        onClick={() => deleteCondition(value)}
      >
        <Trash />
      </button>
    </div>
  );
};

export default SavedCondition;
