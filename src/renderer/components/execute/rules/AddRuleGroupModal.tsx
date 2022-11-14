import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { ProcedureParameter } from 'db/Procedures';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Modal from '../../utils/Modal';
import ParameterContainer from '../ParameterContainer';

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

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const conn = await window.connections.ipcRenderer.fetch();

    const rule: RuleModelType = {
      name: form.name || 'default',
      database: conn[0].defaultDatabase,
      testData: '',
      unitTests: [],
      execution,
      procedure: activeProcedure,
      parameters: form.parameters || [],
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
          <ParameterContainer
            activeParameters={activeParameters}
            setField={setField}
            errors={errors}
          />
        </Form>
      }
      submit={handleSubmit}
    />
  );
};

export default AddRuleGroupModal;
