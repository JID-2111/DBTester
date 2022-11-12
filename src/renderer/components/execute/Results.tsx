import { Table, Button, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
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

interface ILocationState {
  results: ExecutionModelType;
}
const Results = () => {
  const location = useLocation();
  const state = location.state as ILocationState;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // disable for now until execute is finished
  const { results } = state;
  // const execution: ExecutionModelType = {
  //   timestamp: new Date(),
  //   rules: [],
  // };

  // const rule1: RuleModelType = {
  //   name: 'rule1',
  //   ruleId: 0,
  //   database: 'React',
  //   testData: '',
  //   unitTests: [],
  //   execution,
  //   procedure: '',
  //   parameters: [],
  // };

  // const rule2: RuleModelType = {
  //   name: 'rule2',
  //   ruleId: 1,
  //   database: 'React',
  //   testData: '',
  //   unitTests: [],
  //   execution,
  //   procedure: '',
  //   parameters: [],
  // };
  // const test1: TableTestType = {
  //   operation: TableGenericOperations.EXISTS,
  //   level: UnitTestOperations.TableGenericOperations,
  //   name: 'test1',
  //   expectedRecordMatches: RecordMatches.TABLE_ROWS,
  //   total: false,
  //   expectedNumRecords: 0,
  //   table: 'accounts',
  //   result: true,
  //   format: OutputFormat.PLAIN,
  //   output: 'good job',
  //   rule: rule1,
  // };

  // const test2: TableTestType = {
  //   operation: TableGenericOperations.COUNT,
  //   level: UnitTestOperations.TableGenericOperations,
  //   name: 'test2',
  //   expectedRecordMatches: RecordMatches.TABLE_ROWS,
  //   total: true,
  //   expectedNumRecords: 10,
  //   table: 'accounts',
  //   result: false,
  //   format: OutputFormat.PLAIN,
  //   output: 'this test did not pass',
  //   rule: rule1,
  // };

  // const test3: TableTestType = {
  //   operation: TableGenericOperations.COUNT,
  //   level: UnitTestOperations.TableGenericOperations,
  //   name: 'test3',
  //   expectedRecordMatches: RecordMatches.TABLE_ROWS,
  //   total: false,
  //   expectedNumRecords: 2,
  //   table: 'accounts',
  //   result: false,
  //   format: OutputFormat.PLAIN,
  //   output: 'test could use some work',
  //   rule: rule1,
  // };

  // const test4: RowTestType = {
  //   operation: RowNumberOperations.LT,
  //   level: UnitTestOperations.RowNumberOperations,
  //   name: 'test4',
  //   expectedRecordMatches: RecordMatches.TABLE_ROWS,
  //   total: true,
  //   column: 'balance',
  //   expectedNumRecords: 2,
  //   table: 'accounts',
  //   result: true,
  //   format: OutputFormat.PLAIN,
  //   output: 'output goes here',
  //   value: '200',
  //   rule: rule2,
  // };

  // const test5: RowTestType = {
  //   operation: RowNumberOperations.EQ,
  //   level: UnitTestOperations.RowNumberOperations,
  //   name: 'test5',
  //   expectedRecordMatches: RecordMatches.ZERO,
  //   total: true,
  //   column: 'balance',
  //   expectedNumRecords: 2,
  //   table: 'accounts',
  //   result: true,
  //   format: OutputFormat.PLAIN,
  //   output: 'this is an output',
  //   value: '100',
  //   rule: rule2,
  // };

  // rule1.unitTests = [test1, test2, test3];
  // rule2.unitTests = [test4, test5];
  // execution.rules = [rule1, rule2];

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
