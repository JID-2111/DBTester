import { Form, InputGroup } from 'react-bootstrap';
import { ProcedureParameter } from 'db/Procedures';

interface IParameterContainerProps {
  activeParameters: ProcedureParameter[];
  handleInput: (inputValue: string, attribute: string) => void;
}

const ParameterContainer = ({
  activeParameters,
  handleInput,
}: IParameterContainerProps) => {
  if (activeParameters.length > 0) {
    return (
      <div className="parameter-box">
        <h4> Set Procedure Parameters </h4>
        {activeParameters.map(
          (item) =>
            item.direction === 'IN' && (
              <InputGroup className="mb-2" key={`${item.name}`}>
                <InputGroup.Text>
                  {`${item.name} (${item.type})`}
                </InputGroup.Text>
                <Form.Control
                  onChange={(event) =>
                    handleInput(event.target.value, item.name)
                  }
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
