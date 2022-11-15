import { Accordion, Table } from 'react-bootstrap';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import {
  CheckCircle,
  CheckCircleFill,
  XCircle,
  XCircleFill,
} from 'react-bootstrap-icons';
import '../../scss/results.scss';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';

interface IResultsProps {
  results: ExecutionModelType;
}
const Results = ({ results }: IResultsProps) => {
  const passFail = (Rule: RuleModelType): boolean => {
    let pass = true;
    Rule.unitTests.forEach((test) => {
      if (test.result === false) {
        pass = false;
      }
    });
    return pass;
  };

  return (
    <div className="results-screen">
      <div className="table-div">
        <div>
          <h1>Execution Results</h1>
        </div>
        {results.rules.map((rule) => {
          return (
            <Accordion className="accordionClass">
              <AccordionItem eventKey="0">
                <AccordionHeader id="header">
                  <>
                    {passFail(rule) ? (
                      <CheckCircleFill className="Check" color="green" />
                    ) : (
                      <XCircleFill className="X" color="red" />
                    )}
                    {rule.name}
                  </>
                </AccordionHeader>
                <AccordionBody>
                  <Table className="Results-Table">
                    {rule.unitTests.map((Test) => {
                      return (
                        <tbody>
                          <tr key={Test.id}>
                            <td>{Test.name}</td>
                            {Test.result ? (
                              <td> Test Passed </td>
                            ) : (
                              <td> Test Failed</td>
                            )}
                            {Test.result ? (
                              <td>
                                <CheckCircle className="Check" />
                              </td>
                            ) : (
                              <td>
                                <XCircle className="X" />
                              </td>
                            )}
                            <td> {Test.output}</td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </Table>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
