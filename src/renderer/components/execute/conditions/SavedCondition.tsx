import { UnitTestType } from 'db/models/UnitTestModels';
import { Trash } from 'react-bootstrap-icons';

import '../../../scss/Condition.scss';

interface IConditionProps {
  condition: Partial<UnitTestType>;
  deleteCondition: (c: Partial<UnitTestType>) => void;
  key: string;
}

const SavedCondition = ({
  condition,
  deleteCondition,
  key,
}: IConditionProps) => {
  // eslint-disable-next-line no-restricted-globals
  const {
    level,
    column,
    operation,
    value,
    total,
    expectedRecordMatches,
    expectedNumRecords,
    table,
  } = condition;
  return (
    <div key={key} className="condition-item">
      <p>
        {level && `${level} test: `}
        {operation === 'exists' ? `table "${table}" ` : ''}
        {column && `column "${column}" `}
        {operation && `${operation.toUpperCase()} `}
        {value && `"${value}", `}
        {total && `${total} `}
        {expectedRecordMatches && `${expectedRecordMatches} `}
        {expectedNumRecords && `${expectedNumRecords} `}
        {operation !== 'exists' ? `in ${table}` : ''}
      </p>

      <button
        type="button"
        className="deleteButton"
        onClick={() => deleteCondition(condition)}
      >
        <Trash />
      </button>
    </div>
  );
};

export default SavedCondition;
