import { RowOperations, TableOperations, TestLevel } from 'db/entity/enum';
import { useState } from 'react';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { Condition } from 'renderer/types';

import '../../../scss/Condition.scss';

interface IConditionErrors {
  testItem?: boolean;
  condition?: boolean;
  compare?: boolean;
  valueToCheck?: boolean;
}

interface IConditionProps {
  operationType: TestLevel;
  addCondition: (c: Condition) => void;
}

const ConditionForm = ({ operationType, addCondition }: IConditionProps) => {
  const [testItem, setTestItem] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [valueToCheck, setValueToCheck] = useState<string>('');
  const [compare, setCompare] = useState<string>('');
  const [errors, setErrors] = useState<IConditionErrors>({});

  const getCondition = (): Condition => {
    return {
      testItem,
      condition,
      value: valueToCheck,
      compare,
      operationType,
    };
  };

  const validateForm = () => {
    const newErrors: IConditionErrors = {};
    if (!testItem) {
      newErrors.testItem = true;
    }

    if (!condition) {
      newErrors.condition = true;
    }

    if (
      (operationType === TestLevel.COL || condition === 'Count') &&
      !valueToCheck
    ) {
      newErrors.valueToCheck = true;
    }

    if (condition === 'Count' && !compare) {
      newErrors.compare = true;
    }

    return newErrors;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearForm = () => {
    setTestItem('');
    setCondition('');
    setValueToCheck('');
    setCompare('');
  };

  const handleAdd = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    addCondition(getCondition());
    clearForm();
    clearErrors();
  };

  return (
    <div className="condition-item">
      <InputGroup className="condition-input">
        <Form.Control
          placeholder={`${
            operationType === TestLevel.TABLE ? `Table` : `Column`
          } Name`}
          value={testItem}
          onChange={(e) => setTestItem(e.target.value)}
          isInvalid={!!errors.testItem}
        />
      </InputGroup>
      <Dropdown className="condition-dropdown">
        <Dropdown.Toggle variant="primary">{condition}</Dropdown.Toggle>
        <Dropdown.Menu>
          {operationType === TestLevel.COL &&
            Object.values(RowOperations).map((value) => {
              const opKey = `value- + ${value}`;
              return (
                <Dropdown.Item key={opKey} onClick={() => setCondition(value)}>
                  {value}
                </Dropdown.Item>
              );
            })}
          {operationType === TestLevel.TABLE &&
            Object.values(TableOperations).map((value) => {
              const opKey = `value- + ${value}`;
              return (
                <Dropdown.Item key={opKey} onClick={() => setCondition(value)}>
                  {value}
                </Dropdown.Item>
              );
            })}
        </Dropdown.Menu>
      </Dropdown>
      {condition === 'Count' && (
        <Dropdown className="compare-dropdown">
          <Dropdown.Toggle variant="primary">{compare}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item key="1" onClick={() => setCompare('>')}>
              &gt;
            </Dropdown.Item>
            <Dropdown.Item key="2" onClick={() => setCompare('<')}>
              &lt;
            </Dropdown.Item>
            <Dropdown.Item key="3" onClick={() => setCompare('=')}>
              =
            </Dropdown.Item>
            <Dropdown.Item key="4" onClick={() => setCompare('>=')}>
              &gt;=
            </Dropdown.Item>
            <Dropdown.Item key="5" onClick={() => setCompare('<=')}>
              &lt;=
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {(operationType === TestLevel.COL || condition === 'Count') && (
        <InputGroup className="condition-input">
          <Form.Control
            placeholder="Value"
            aria-label="Value"
            aria-describedby="basic-addon1"
            value={valueToCheck}
            onChange={(e) => setValueToCheck(e.target.value)}
            isInvalid={!!errors.valueToCheck}
          />
        </InputGroup>
      )}
      <Button
        className={`add-condition-btn ${
          operationType === TestLevel.TABLE && condition !== 'Count'
            ? 'add-btn-table-value-inactive'
            : ''
        }`}
        onClick={handleAdd}
      >
        Add
      </Button>
    </div>
  );
};

export default ConditionForm;
