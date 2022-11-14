import { ExecutionModelType } from 'db/models/ExecutionModel';
import { useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';

interface IExecuteCellProps {
  handleExecute: () => void;
  execution: ExecutionModelType;
  setExecution: (execution: ExecutionModelType) => void;
}

const ExecuteCell = ({
  handleExecute,
  execution,
  setExecution,
}: IExecuteCellProps) => {
  const [errorMsg, setErrorMsg] = useState<string>('');

  const checkForm = () => {
    if (execution.name === '') {
      setErrorMsg('Add a Title to Execution!');
      return;
    }

    handleExecute();
  };

  return (
    <Row className="justify-content-center">
      <Form.Control
        className="form-control-sm"
        value={execution.name}
        onChange={(e) => {
          setExecution({ ...execution, name: e.target.value });
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
