import { DBColumn } from 'db/clients/PgClient';
import {
  RecordMatches,
  RowBooleanOperations,
  RowIDOperations,
  RowNumberOperations,
  RowStringOperations,
  TableGenericOperations,
  UnitTestOperations,
} from 'db/entity/enum';
import { useEffect, useState } from 'react';
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
  addCondition: (c: Condition) => void;
  table: string;
}

const ConditionForm = ({ addCondition, table }: IConditionProps) => {
  const [form, setForm] = useState<Condition>({ table });
  const [errors, setErrors] = useState<IConditionErrors>({});
  const [opValues, setOpValues] = useState<string[]>([]);
  const [columns, setColumns] = useState<DBColumn[]>([]);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const setField = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  // fix error checking for form creation
  // const validateForm = () => {
  //   const newErrors: IConditionErrors = {};
  //   if (!testItem) {
  //     newErrors.testItem = true;
  //   }

  //   if (!condition) {
  //     newErrors.condition = true;
  //   }

  //   // if (
  //   //   (operationType === UnitTestOperations.COL || condition === 'Count') && !valueToCheck
  //   // ) {
  //   //   newErrors.valueToCheck = true;
  //   // }

  //   if (condition === 'Count' && !compare) {
  //     newErrors.compare = true;
  //   }

  //   return newErrors;
  // };

  const clearErrors = () => {
    setErrors({});
  };

  const clearForm = () => {
    setForm({});
  };

  const handleAdd = () => {
    // const formErrors = validateForm();
    // if (Object.keys(formErrors).length > 0) {
    //   setErrors(formErrors);
    //   return;
    // }

    addCondition(form);

    clearForm();
    clearErrors();
  };

  const updateLevel = (level: UnitTestOperations) => {
    setForm({ table, level });

    switch (level) {
      case UnitTestOperations.TableGenericOperations:
        setOpValues(Object.values(TableGenericOperations));
        break;
      case UnitTestOperations.RowBooleanOperations:
        setOpValues(Object.values(RowBooleanOperations));
        break;
      case UnitTestOperations.RowIDOperations:
        setOpValues(Object.values(RowIDOperations));
        break;
      case UnitTestOperations.RowNumberOperations:
        setOpValues(Object.values(RowNumberOperations));
        break;
      case UnitTestOperations.RowStringOperations:
        setOpValues(Object.values(RowStringOperations));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const getColumns = async () => {
      const cols = await window.procedures.ipcRenderer.fetchColumns(table);
      setColumns(cols);
    };
    clearForm();
    clearErrors();
    getColumns();
  }, [table]);

  if (!form.level) {
    return (
      <div className="condition-item">
        <Dropdown className="operation-dropdown">
          <Dropdown.Toggle variant="primary">op type</Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.values(UnitTestOperations).map((level, idx) => {
              const key = `level- + ${idx}`;
              return (
                <Dropdown.Item key={key} onClick={() => updateLevel(level)}>
                  {level}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }

  return (
    <div className="condition-item">
      <Dropdown className="operation-dropdown">
        <Dropdown.Toggle variant="primary">{form.level}</Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.values(UnitTestOperations).map((level, idx) => {
            const key = `level- + ${idx}`;
            return (
              <Dropdown.Item key={key} onClick={() => updateLevel(level)}>
                {level}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      {form.level !== UnitTestOperations.TableGenericOperations && (
        <Dropdown className="condition-dropdown">
          <Dropdown.Toggle variant="primary">{form.column}</Dropdown.Toggle>
          <Dropdown.Menu>
            {columns.map((col, idx) => {
              const colName = col.column_name;
              const colKey = `col- + ${idx}`;
              return (
                <Dropdown.Item
                  key={colKey}
                  onClick={() => setField('column', colName)}
                >
                  {colName}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {form.level && (
        <Dropdown className="condition-dropdown">
          <Dropdown.Toggle variant="primary">{form.operation}</Dropdown.Toggle>
          <Dropdown.Menu>
            {opValues.map((value, idx) => {
              const opKey = `value- + ${idx}`;
              return (
                <Dropdown.Item
                  key={opKey}
                  onClick={() => setField('operation', value)}
                >
                  {value}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}
      {!(
        form.level === UnitTestOperations.TableGenericOperations ||
        form.level === UnitTestOperations.RowBooleanOperations
      ) && (
        <InputGroup className="condition-input">
          <Form.Control
            placeholder="Value"
            type={
              form.level === UnitTestOperations.RowNumberOperations
                ? 'number'
                : 'text'
            }
            value={form.value}
            onChange={(e) => setField('value', e.target.value)}
            isInvalid={!!errors.valueToCheck}
          />
        </InputGroup>
      )}
      {(form.level !== UnitTestOperations.TableGenericOperations ||
        (form.operation && !(form.operation === 'exists'))) && (
        <>
          <Dropdown className="condition-dropdown">
            <Dropdown.Toggle variant="primary">{form.total}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                key="1"
                onClick={() => setField('total', 'new records')}
              >
                new records
              </Dropdown.Item>
              <Dropdown.Item
                key="2"
                onClick={() => setField('total', 'total records')}
              >
                total records
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="condition-dropdown">
            <Dropdown.Toggle variant="primary">
              {form.expectedRecordMatches}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.values(RecordMatches).map((match, idx) => {
                const key = `match- + ${idx}`;
                return (
                  <Dropdown.Item
                    key={key}
                    onClick={() => setField('expectedRecordMatches', match)}
                  >
                    {match}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
      {form.expectedRecordMatches === 'is = to' && (
        <InputGroup className="condition-input">
          <Form.Control
            placeholder="record value"
            type="number"
            value={form.expectedNumRecords}
            onChange={(e) => setField('expectedNumRecords', e.target.value)}
            isInvalid={!!errors.valueToCheck}
          />
        </InputGroup>
      )}
      <Button
        className={`add-condition-btn ${
          form.level === UnitTestOperations.TableGenericOperations &&
          form.operation !== 'count'
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
