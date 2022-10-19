import { useEffect, useState } from 'react';
import { ProcedureParameter } from 'db/Procedures';
import { Form, InputGroup } from 'react-bootstrap';

interface IParameterContainerProps {
  procedure: string;
}

const ParameterContainer = ({ procedure }: IParameterContainerProps) => {
  const [parameters, setParameters] = useState<ProcedureParameter[]>([]);
  useEffect(() => {
    const getParams = async () => {
      const params = await window.procedures.ipcRenderer.getProcedureParameters(
        procedure
      );
      setParameters(params);
    };
    getParams();
  }, [procedure]);

  if (parameters.length > 0) {
    return (
      <div className="condition-box">
        <h4> Set Procedure Parameters </h4>
        {parameters.map(
          (item) =>
            item.direction === 'IN' && (
              <InputGroup className="mb-2" key={`SP-parameter-${item.name}`}>
                <InputGroup.Text>{`${item.name} (${item.type})`}</InputGroup.Text>
                <Form.Control aria-label="Value" />
              </InputGroup>
            )
        )}
      </div>
    );
  }
  return <div />;
};

export default ParameterContainer;
