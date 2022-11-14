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
  addRule: (r: Partial<RuleModelType>) => void;
  activeParameters: ProcedureParameter[];
  activeProcedure: string;
}

export interface IRuleGroupErrors {
  name: string;
  parameters: string[];
}

const AddRuleGroupModal = ({
  isOpen,
  toggle,
  addRule,
  activeParameters,
  activeProcedure,
}: IModalProps) => {
  const [form, setForm] = useState<Partial<RuleModelType>>({});
  const [errors, setErrors] = useState<Partial<IRuleGroupErrors>>({});
  const [tables, setTables] = useState<ListOption[]>([]);

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
    const { name, parameters } = form;

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

    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    addRule(form);
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
          <ParameterContainer
            activeParameters={activeParameters}
            setField={setField}
            errors={errors}
          />
          <Form.Group className="form-group">
            <Form.Label variant="primary">Data Table</Form.Label>
            <Form.Select
              onChange={(e) => {
                setField('testData', e.target.value);
              }}
            >
              {!form.testData && <option aria-label="empty-option" />}
              {tables &&
                tables.map((table: ListOption) => {
                  const tableKey = `table- + ${table}`;
                  return (
                    <option key={tableKey} value={table.value}>
                      {table.value}
                    </option>
                  );
                })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="form-group" controlId="cleanup">
            <Form.Label className="form-label-sm">Cleanup Tables</Form.Label>
            <Select
              isMulti
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
        </Form>
      }
      submit={handleSubmit}
    />
  );
};

export default AddRuleGroupModal;
