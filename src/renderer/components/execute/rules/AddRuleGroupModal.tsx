import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { ProcedureParameter } from 'db/Procedures';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Modal from '../../utils/Modal';
import ParameterContainer from '../ParameterContainer';

const animatedComponents = makeAnimated();

type ListOption = {
  value: string;
  label: string;
};

interface IModalProps {
  isOpen: boolean;
  toggle: () => void;
  activeParameters: ProcedureParameter[];
  activeProcedure: string;
  execution: ExecutionModelType;
  setExecution: (execution: ExecutionModelType) => void;
}

export interface IRuleGroupErrors {
  name: string;
  parameters: string[];
  testDataParameterIndex: string;
  testDataFilePath: string;
  testData: string;
}

const AddRuleGroupModal = ({
  isOpen,
  toggle,
  activeParameters,
  activeProcedure,
  execution,
  setExecution,
}: IModalProps) => {
  const [form, setForm] = useState<Partial<RuleModelType>>({});
  const [errors, setErrors] = useState<Partial<IRuleGroupErrors>>({});
  const [tables, setTables] = useState<ListOption[]>([]);
  const [useData, setUseData] = useState<boolean>(false);

  useEffect(() => {
    const getTables = async () => {
      const resp = await window.procedures.ipcRenderer.fetchTables();
      setTables(
        resp.map((t) => {
          return {
            value: t,
            label: t,
          };
        })
      );
    };
    getTables();
  }, []);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const setFields = (input: Record<string, any>) => {
    setForm({
      ...form,
      ...input,
    });

    Object.keys(input).forEach((key) => {
      if (errors[key as keyof IRuleGroupErrors]) {
        setErrors({
          ...errors,
          [key]: null,
        });
      }
    });
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const setField = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (errors[field as keyof IRuleGroupErrors]) {
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
    const newErrors: Partial<IRuleGroupErrors> = {};
    const { name, parameters, hasTestData } = form;

    if (!name) {
      newErrors.name = 'Please type a name.';
    }

    let isParamError = false;
    const paramErrors = parameters?.map((param) => {
      if (param === '') {
        isParamError = true;
        return 'Please fill out this parameter.';
      }
      return '';
    });

    if (isParamError) {
      newErrors.parameters = paramErrors;
    }

    if (hasTestData) {
      if (
        form.testDataParameterIndex === -1 ||
        form.testDataParameterIndex === undefined
      )
        newErrors.testDataParameterIndex =
          'Please select a parameter to pass data.';
      if (!form.testDataFilePath)
        newErrors.testDataFilePath = 'Please select a data file.';
      if (!form.testData) newErrors.testData = 'Please select a data table.';
    }
    return newErrors;
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event === null || event === undefined) return;
    if (event.target.files === null) return;
    setField('testDataFilePath', event.target.files[0].path);
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const rule: RuleModelType = {
      name: form.name || 'default',
      unitTests: [],
      execution,
      parameters: form.parameters || [],
      cleanupTables: form.cleanupTables,
      hasTestData: form.hasTestData || false,
      testData: form.testData || '',
      testDataParameterIndex: form.testDataParameterIndex || -1,
      testDataFilePath: form.testDataFilePath || '',
    };

    execution.rules.push(rule);
    setExecution(execution);

    clearForm();
    toggle();
  };

  return (
    <Modal
      show={isOpen}
      handleClose={toggle}
      title="Add Rule Group"
      modalBody={
        <Form className="form-modal" onSubmit={() => handleSubmit()}>
          <Form.Group className="form-group" controlId="name">
            <Form.Label className="form-label-sm">Name</Form.Label>
            <Form.Control
              className="form-control-sm"
              value={form.name}
              onChange={(e) => {
                setField('name', e.target.value);
              }}
              type="text"
              placeholder="Rule Group Name"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group" controlId="procedure">
            <Form.Label className="form-label-sm">Procedure</Form.Label>
            <Form.Control
              className="form-control-sm"
              value={activeProcedure}
              type="text"
              placeholder="Procedure"
              disabled
            />
          </Form.Group>
          <Form.Group className="form-group" controlId="has-test-data">
            <Form.Label variant="primary" className="form-label-sm">
              {' '}
              Has Test Data{' '}
            </Form.Label>
            <Form.Check
              type="switch"
              onChange={(e) => {
                setUseData(e.target.checked);
                if (e.target.checked) {
                  setField('hasTestData', e.target.checked);
                } else {
                  setFields({
                    hasTestData: e.target.checked,
                    testDataParameterIndex: -1,
                    testDataFilePath: '',
                    testData: '',
                  });
                }
              }}
            />
          </Form.Group>
          <ParameterContainer
            activeParameters={activeParameters}
            setField={setField}
            errors={errors}
            showData={useData}
          />
          {useData && (
            <div>
              <Form.Group className="form-group" controlId="test-data">
                <Form.Label className="form-label-sm">Test Data</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  isInvalid={!!errors.testDataFilePath}
                  onChange={handleUpload}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.testDataFilePath}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label variant="primary">Data Table</Form.Label>
                <Form.Select
                  isInvalid={!!errors.testData}
                  onChange={(e) => {
                    setField('testData', e.target.value);
                  }}
                >
                  {!form.testData && <option aria-label="empty-option" />}
                  {tables &&
                    tables.map((table: ListOption) => {
                      const tableKey = `table-${table.value}`;
                      return (
                        <option key={tableKey} value={table.value}>
                          {table.value}
                        </option>
                      );
                    })}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.testData}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="form-group" controlId="cleanup">
                <Form.Label className="form-label-sm">
                  Cleanup Tables
                </Form.Label>
                <Select
                  isMulti
                  required
                  options={tables}
                  components={animatedComponents}
                  className="form-control-sm"
                  onChange={(e) => {
                    setField(
                      'cleanupTables',
                      e.map((t) => (t as ListOption).value)
                    );
                  }}
                />
              </Form.Group>
            </div>
          )}
        </Form>
      }
      submit={handleSubmit}
    />
  );
};

export default AddRuleGroupModal;
