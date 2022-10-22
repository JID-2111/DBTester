import { Form, InputGroup } from 'react-bootstrap';
import { ProcedureParameter } from 'db/Procedures';

interface IParameterContainerProps {
  activeParameters: ProcedureParameter[];
}

const ParameterContainer = ({ activeParameters }: IParameterContainerProps) => {
  if (activeParameters.length > 0) {
    return (
      <div className="condition-box">
        <h4> Set Procedure Parameters </h4>
        {activeParameters.map(
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
