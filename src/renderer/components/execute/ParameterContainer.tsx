import { Form, InputGroup } from 'react-bootstrap';
import { ProcedureParameter } from 'db/Procedures';
import { useEffect, useState } from 'react';
import { IRuleGroupErrors } from './rules/AddRuleGroupModal';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IParameterContainerProps {
  activeParameters: ProcedureParameter[];
  setField: (field: string, value: any) => void;
  errors: Partial<IRuleGroupErrors>;
}

export type Parameter = {
  [key: string]: string;
};

const ParameterContainer = ({
  activeParameters,
  setField,
  errors,
}: IParameterContainerProps) => {
  const [parameterValues, setParameterValues] = useState<Parameter>({});

  const handleChange = (inputValue: string, attribute: string) => {
    setParameterValues({
      ...parameterValues,
      [attribute]: inputValue,
    });
  };

  useEffect(() => {
    const defaultValues: Parameter = {};
    activeParameters.forEach((item) => {
      defaultValues[item.name] = '';
    });
    setParameterValues(defaultValues);
  }, [activeParameters]);

  useEffect(() => {
    setField('parameters', Object.values(parameterValues));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameterValues]);

  if (activeParameters.length > 0) {
    return (
      <div className="parameter-box">
        <Form.Label className="form-label-sm">
          {' '}
          Set Procedure Parameters{' '}
        </Form.Label>
        {activeParameters &&
          activeParameters.map(
            (item, idx) =>
              item.direction === 'IN' && (
                <InputGroup className="mb-2" key={`${item.name}`}>
                  <InputGroup.Text>
                    {`${item.name} (${item.type})`}
                  </InputGroup.Text>
                  <Form.Control
                    onChange={(event) =>
                      handleChange(event.target.value, item.name)
                    }
                    aria-label="value"
                    isInvalid={errors.parameters && !!errors.parameters[idx]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.parameters && errors.parameters[idx]}
                  </Form.Control.Feedback>
                </InputGroup>
              )
          )}
      </div>
    );
  }
  return <div />;
};

export default ParameterContainer;
