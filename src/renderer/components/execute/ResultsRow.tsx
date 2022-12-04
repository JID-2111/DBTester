import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import { OutputFormat } from '../../../db/entity/enum';
import { UnitTestType } from '../../../db/models/UnitTestModels';
import { getUnitTestDescription } from '../utils/helpers';
import Modal from '../utils/Modal';
import Table from '../utils/Table';

interface IResultsProps {
  result: UnitTestType;
}

const ResultsRow = ({ result }: IResultsProps) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <tr key={result.id}>
      <td>{result.name}</td>
      {result.result ? (
        <td> Test Passed </td>
      ) : (
        <td> {getUnitTestDescription(result)} </td>
      )}
      {result.result ? (
        <td>
          <CheckCircle className="Check" />
        </td>
      ) : (
        <td>
          <XCircle className="X" />
        </td>
      )}
      {result.format === OutputFormat.JSON && result.output !== undefined ? (
        <td>
          <Button variant="primary" onClick={handleShow}>
            View Output
          </Button>
          <Modal
            fullscreen
            show={show}
            handleClose={handleClose}
            title={result.name}
            modalBody={
              <Table
                headers={Object.keys(JSON.parse(result.output)[0])}
                rows={JSON.parse(result.output)}
              />
            }
          />
        </td>
      ) : (
        <td> {result.output}</td>
      )}
    </tr>
  );
};

export default ResultsRow;
