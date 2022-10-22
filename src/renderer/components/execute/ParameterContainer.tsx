import { Form, InputGroup } from 'react-bootstrap';
import { ProcedureParameter } from 'db/Procedures';

interface IParameterContainerProps {
  activeParameters: ProcedureParameter[];
  handleInput: (
    e: React.ChangeEvent<HTMLInputElement>,
    attribute: string
  ) => void;
}

const ParameterContainer = ({
  activeParameters,
  handleInput,
}: IParameterContainerProps) => {
  if (activeParameters.length > 0) {
    return (
      <div className="condition-box">
        <h4> Set Procedure Parameters </h4>
        {activeParameters.map(
          (item) =>
            item.direction === 'IN' && (
              <InputGroup className="mb-2" key={`${item.name}`}>
                <InputGroup.Text bsPrefix="paramater-text">
                  {`${item.name} (${item.type})`}
                </InputGroup.Text>
                <Form.Control
                  onInput={(event) => handleInput(event as any, item.name)}
                  aria-label="value"
                />
              </InputGroup>
            )
        )}
      </div>
    );
  }
  return <div />;
};

export default ParameterContainer;
