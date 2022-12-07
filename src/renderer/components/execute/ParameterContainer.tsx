import { Form, InputGroup } from 'react-bootstrap';
import { ProcedureParameter } from 'db/Procedures';
import { useEffect, useState } from 'react';
import { IRuleGroupErrors } from './rules/AddRuleGroupModal';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IParameterContainerProps {
  activeParameters: ProcedureParameter[];
  setField: (field: string, value: any) => void;
  showData: boolean;
  errors: Partial<IRuleGroupErrors>;
}

export type Parameter = {
  [key: string]: string;
};

const ParameterContainer = ({
  activeParameters,
  setField,
  showData,
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
                <div>
                  <InputGroup key={`${item.name}`}>
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
                  {showData && (
                    <Form.Group controlId="data-parameter">
                      <Form.Check
                        name="data-select"
                        type="radio"
                        id="custom-switch"
                        isInvalid={!!errors.testDataParameterIndex}
                        onChange={(_event) => {
                          console.log('test data parameter index', idx);
                          setField('testDataParameterIndex', Number(idx));
                        }}
                      />
                    </Form.Group>
                  )}
                </div>
              )
          )}
      </div>
    );
  }
  return <div />;
};

export default ParameterContainer;
