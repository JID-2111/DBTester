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
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Modal from '../../utils/Modal';

interface IModalProps {
  isOpen: boolean;
  toggle: () => void;
  execution: ExecutionModelType;
  addCondition: (condition: UnitTestType, rule: RuleModelType) => void;
}

interface IUnitTestFormErrors {
  name: string;
  table: string;
  level: string;
  value: string;
  operation: string;
  column: string;
  total: string;
  expectedRecordMatches: string;
  expectedNumRecords: string;
  rule: string;
}

const AddUnitTestModal = ({
  isOpen,
  toggle,
  execution,
  addCondition,
}: IModalProps) => {
  const [form, setForm] = useState<Partial<UnitTestType>>({});
  const [errors, setErrors] = useState<Partial<IUnitTestFormErrors>>({});

  const [tables, setTables] = useState<string[]>([]);
  const [currTable, setCurrTable] = useState<string>();

  const [opValues, setOpValues] = useState<string[]>([]);
  const [columns, setColumns] = useState<DBColumn[]>([]);

  useEffect(() => {
    const getTables = async () => {
      const fetchedTables = await window.procedures.ipcRenderer.fetchTables();
      setTables(fetchedTables);
    };
    getTables();
  }, []);

  const isTableOp = () => {
    return form.level === UnitTestOperations.TableGenericOperations;
  };

  const isRowBooleanOp = () => {
    return form.level === UnitTestOperations.RowBooleanOperations;
  };

  const isRowNumberOp = () => {
    return form.level === UnitTestOperations.RowNumberOperations;
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const setField = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (errors[field as keyof IUnitTestFormErrors]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const clearForm = () => {
    setForm({});
  };

  const validateForm = () => {
    const newErrors: Partial<IUnitTestFormErrors> = {};
    const {
      name,
      table,
      level,
      value,
      operation,
      column,
      total,
      expectedRecordMatches,
      expectedNumRecords,
      rule,
    } = form;

    if (!name) {
      newErrors.name = 'Please type a name.';
    }

    if (!rule) {
      newErrors.rule = 'Please select a rule group.';
    }

    if (!table) {
      newErrors.table = 'Please select a table.';
    } else if (!level) {
      newErrors.level = 'Please select a test type.';
    } else {
      if (!operation) {
        newErrors.operation = 'Please select an operation to perform.';
      }

      if (operation !== 'exists') {
        if (!total) {
          newErrors.total = 'Please select new or total records.';
        }

        if (!expectedRecordMatches) {
          newErrors.expectedRecordMatches = 'Please select a comparison type.';
        }

        if (form.expectedRecordMatches === 'is = to' && !expectedNumRecords) {
          newErrors.expectedNumRecords =
            'Please select the expected number of records.';
        }
      }

      if (!isTableOp()) {
        if (!isRowBooleanOp() && !value) {
          newErrors.value = 'Please enter a value.';
        }

        if (!column) {
          newErrors.column = 'Please select a column to test against.';
        }

        if (!total) {
          newErrors.total = 'Please select new or total records.';
        }

        if (!expectedRecordMatches) {
          newErrors.expectedRecordMatches = 'Please select a comparison type.';
        }

        if (form.expectedRecordMatches === 'is = to' && !expectedNumRecords) {
          newErrors.expectedNumRecords =
            'Please select the expected number of records.';
        }
      }
    }

    return newErrors;
  };

  const constructUnitTest = () => {
    const newUnitTest: UnitTestType = {
      level: form.level || UnitTestOperations.TableGenericOperations,
      name: form.name || 'Default Name',
      expectedRecordMatches: form.expectedRecordMatches,
      total: form.total,
      expectedNumRecords: Number(form.expectedNumRecords),
      table: form.table || 'Default Table',
      column: form.column,
      value: form.value,
      operation: form.operation || TableGenericOperations.EXISTS,
      result: form.result,
      format: form.format,
      output: form.output,
      rule: form.rule || execution.rules[0],
    };
    return newUnitTest;
  };

  useEffect(() => {
    const getColumns = async () => {
      if (currTable) {
        const cols = await window.procedures.ipcRenderer.fetchColumns(
          currTable
        );
        setColumns(cols);
      }
    };
    clearForm();
    setField('table', currTable);
    getColumns();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currTable]);

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const unitTest = constructUnitTest();

    addCondition(unitTest, unitTest.rule);

    clearForm();
    toggle();
  };

  const handleRuleSelect = (ruleName: string) => {
    const rule = execution.rules.find((r) => r.name === ruleName);
    setField('rule', rule);
  };

  const updateLevel = (level: UnitTestOperations) => {
    setField('level', level);

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

  return (
    <Modal
      show={isOpen}
      handleClose={toggle}
      title="Add Unit Test"
      modalBody={
        <Form className="form-modal" onSubmit={() => handleSubmit()}>
          <Form.Group className="form-group" controlId="name">
            <Form.Label className="form-label-sm">Test Name</Form.Label>
            <Form.Control
              className="form-control-sm"
              value={form.name || ''}
              onChange={(e) => {
                setField('name', e.target.value);
              }}
              type="text"
              placeholder="Unit Test Name"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label variant="primary">Table</Form.Label>
            <Form.Select
              onChange={(e) => setCurrTable(e.target.value)}
              isInvalid={!!errors.table}
            >
              {!currTable && <option aria-label="empty-option" />}
              {tables &&
                tables.map((table) => {
                  const tableKey = `table- + ${table}`;
                  return (
                    <option key={tableKey} value={table}>
                      {table}
                    </option>
                  );
                })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.table}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label variant="primary">Rule Group</Form.Label>
            <Form.Select
              onChange={(e) => handleRuleSelect(e.target.value)}
              isInvalid={!!errors.rule}
            >
              {!form.rule && <option aria-label="empty-option" />}
              {execution.rules.map((rule) => {
                const ruleName = rule.name;
                const ruleKey = rule.id;
                return <option key={ruleKey}>{ruleName}</option>;
              })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.rule}
            </Form.Control.Feedback>
          </Form.Group>

          <hr />

          {form.table && (
            <Form.Group className="form-group" controlId="level">
              <Form.Label className="form-label-sm"> Test Type</Form.Label>
              <Form.Select
                className="form-control-sm"
                isInvalid={!!errors.level}
                onChange={(e) =>
                  updateLevel(e.target.value as UnitTestOperations)
                }
              >
                {!form.level && <option aria-label="empty-option" />}
                {Object.values(UnitTestOperations).map((level, idx) => {
                  const key = `level- + ${idx}`;
                  return (
                    <option
                      value={level}
                      key={key}
                      onClick={() => updateLevel(level)}
                    >
                      {level}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.level}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {form.level && <hr />}

          {form.level && !isTableOp() && (
            <Form.Group className="form-group">
              <Form.Label variant="primary">
                Test Column in &quot;{form.table}&quot;
              </Form.Label>
              <Form.Select
                onChange={(e) => setField('column', e.target.value)}
                isInvalid={!!errors.column}
              >
                {!form.column && <option aria-label="empty-option" />}
                {columns.map((col, idx) => {
                  const colName = col.column_name;
                  const colKey = `col- + ${idx}`;
                  return <option key={colKey}>{colName}</option>;
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.column}
              </Form.Control.Feedback>
            </Form.Group>
          )}
          {form.level && (
            <Form.Group className="form-group">
              <Form.Label variant="primary">Operation</Form.Label>
              <Form.Select
                onChange={(e) => setField('operation', e.target.value)}
                isInvalid={!!errors.operation}
              >
                {!form.operation && <option aria-label="empty-option" />}
                {opValues.map((value, idx) => {
                  const opKey = `value- + ${idx}`;
                  return <option key={opKey}>{value}</option>;
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.operation}
              </Form.Control.Feedback>
            </Form.Group>
          )}
          {form.level && !(isTableOp() || isRowBooleanOp()) && (
            <Form.Group className="form-group">
              <Form.Label>Value</Form.Label>
              <Form.Control
                placeholder="Value"
                type={isRowNumberOp() ? 'number' : 'text'}
                value={form.value || ''}
                onChange={(e) => setField('value', e.target.value)}
                isInvalid={!!errors.value}
              />
              <Form.Control.Feedback type="invalid">
                {errors.value}
              </Form.Control.Feedback>
            </Form.Group>
          )}
          {form.level &&
            (!isTableOp() ||
              (form.operation && !(form.operation === 'exists'))) && (
              <>
                <Form.Group className="form-group">
                  <Form.Label variant="primary">New/Total</Form.Label>
                  <Form.Select
                    onChange={(e) => setField('total', e.target.value)}
                    isInvalid={!!errors.total}
                  >
                    {!form.total && <option aria-label="empty-option" />}
                    <option key="1">new records</option>
                    <option key="2">total records</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.total}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label variant="primary">
                    Expected Record Matches
                  </Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setField('expectedRecordMatches', e.target.value)
                    }
                    isInvalid={!!errors.expectedRecordMatches}
                  >
                    {!form.expectedRecordMatches && (
                      <option aria-label="empty-option" />
                    )}
                    {Object.values(RecordMatches).map((match, idx) => {
                      const key = `match- + ${idx}`;
                      return <option key={key}>{match}</option>;
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.expectedRecordMatches}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
          {form.level && form.expectedRecordMatches === 'is = to' && (
            <Form.Group className="form-group">
              <Form.Label>Value</Form.Label>
              <Form.Control
                placeholder="record value"
                type="number"
                value={form.expectedNumRecords || ''}
                onChange={(e) => setField('expectedNumRecords', e.target.value)}
                isInvalid={!!errors.expectedNumRecords}
              />
              <Form.Control.Feedback type="invalid">
                {errors.expectedNumRecords}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </Form>
      }
      submit={handleSubmit}
    />
  );
};

export default AddUnitTestModal;
