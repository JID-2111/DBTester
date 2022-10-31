import { Table, Button, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { CheckLg, XLg } from 'react-bootstrap-icons';
import '../../scss/results.scss';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';

interface ILocationState {
  results: ExecutionModelType;
}
const Results = () => {
  const location = useLocation();
  const state = location.state as ILocationState;
  const { results } = state;

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
        <Accordion className="accordionClass">
          {results.rules.map((rule) => {
            return (
              <AccordionItem eventKey="0">
                <AccordionHeader>
                  {passFail(rule) ? (
                    <>{(rule.name, (<CheckLg />))}</>
                  ) : (
                    rule.name
                  )}
                </AccordionHeader>
                <AccordionBody>
                  {rule.unitTests.map((Test) => {
                    return (
                      <Table className="Results-Table">
                        <tr key={Test.id}>
                          <td>{Test.name}</td>
                          {Test.result ? (
                            <td> test Passed </td>
                          ) : (
                            <td> Test Failed</td>
                          )}
                          {Test.result ? <CheckLg /> : <XLg />}
                          <td> {Test.output}</td>
                        </tr>
                      </Table>
                    );
                  })}
                </AccordionBody>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className="homeButton">
        <Link to="/">
          <Button type="button">Home</Button>
        </Link>
        <Link to="/Execute">
          <Button>Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default Results;
