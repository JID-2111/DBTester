import { useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';

interface IExecuteCellProps {
  handleExecute: (executionName: string) => void;
}

const ExecuteCell = ({ handleExecute }: IExecuteCellProps) => {
  const [executionName, setExecutionName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const checkForm = () => {
    if (executionName === '') {
      setErrorMsg('Add a Title to Execution!');
      return;
    }

    handleExecute(executionName);
    setExecutionName('');
  };

  return (
    <Row className="justify-content-center">
      <Form.Control
        className="form-control-sm"
        value={executionName}
        onChange={(e) => {
          setExecutionName(e.target.value);
          setErrorMsg('');
        }}
        type="text"
        placeholder="Title of Execution"
        isInvalid={errorMsg !== ''}
      />
      <Form.Control.Feedback type="invalid">{errorMsg}</Form.Control.Feedback>
      <Button onClick={checkForm} className="execute-btn">
        Execute Tests
      </Button>
    </Row>
  );
};

export default ExecuteCell;
