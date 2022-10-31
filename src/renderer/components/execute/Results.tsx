import { Table, Button, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { CheckLg, XLg } from 'react-bootstrap-icons';
import '../../scss/results.scss';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import {
  TableGenericOperations,
  UnitTestOperations,
  OutputFormat,
  RecordMatches,
  RowNumberOperations,
} from 'db/entity/enum';
import { TableTestType, RowTestType } from 'db/models/UnitTestModels';

interface ILocationState {
  results: ExecutionModelType;
}
const Results = () => {
  const location = useLocation();
  const state = location.state as ILocationState;
  const { results } = state;
  const execution: ExecutionModelType = {
    timestamp: new Date(),
    rules: [],
  };

  const rule1: RuleModelType = {
    name: 'rule1',
    ruleId: 0,
    database: 'React',
    testData: '',
    unitTests: [],
    execution,
    procedure: '',
    parameters: [],
  };

  const rule2: RuleModelType = {
    name: 'rule2',
    ruleId: 1,
    database: 'React',
    testData: '',
    unitTests: [],
    execution,
    procedure: '',
    parameters: [],
  };
  const test1: TableTestType = {
    operation: TableGenericOperations.EXISTS,
    level: UnitTestOperations.TableGenericOperations,
    name: 'test1',
    expectedRecordMatches: RecordMatches.TABLE_ROWS,
    total: false,
    expectedNumRecords: 0,
    table: 'accounts',
    result: true,
    format: OutputFormat.PLAIN,
    output: '',
    rule: rule1,
  };

  const test2: TableTestType = {
    operation: TableGenericOperations.COUNT,
    level: UnitTestOperations.TableGenericOperations,
    name: 'test2',
    expectedRecordMatches: RecordMatches.TABLE_ROWS,
    total: true,
    expectedNumRecords: 10,
    table: 'accounts',
    result: false,
    format: OutputFormat.PLAIN,
    output: '',
    rule: rule1,
  };

  const test3: TableTestType = {
    operation: TableGenericOperations.COUNT,
    level: UnitTestOperations.TableGenericOperations,
    name: 'test3',
    expectedRecordMatches: RecordMatches.TABLE_ROWS,
    total: false,
    expectedNumRecords: 2,
    table: 'accounts',
    result: false,
    format: OutputFormat.PLAIN,
    output: '',
    rule: rule1,
  };

  const test4: RowTestType = {
    operation: RowNumberOperations.LT,
    level: UnitTestOperations.RowNumberOperations,
    name: 'test4',
    expectedRecordMatches: RecordMatches.TABLE_ROWS,
    total: true,
    column: 'balance',
    expectedNumRecords: 2,
    table: 'accounts',
    result: true,
    format: OutputFormat.PLAIN,
    output: '',
    value: '200',
    rule: rule2,
  };

  const test5: RowTestType = {
    operation: RowNumberOperations.EQ,
    level: UnitTestOperations.RowNumberOperations,
    name: 'test5',
    expectedRecordMatches: RecordMatches.ZERO,
    total: true,
    column: 'balance',
    expectedNumRecords: 2,
    table: 'accounts',
    result: true,
    format: OutputFormat.PLAIN,
    output: '',
    value: '100',
    rule: rule2,
  };

  rule1.unitTests = [test1, test2, test3];
  rule2.unitTests = [test4, test5];
  execution.rules = [rule1, rule2];
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
        {execution.rules.map((rule) => {
          return (
            <Accordion className="accordionClass">
              <AccordionItem eventKey="0">
                <AccordionHeader>
                  {passFail(rule) ? (rule.name, (<CheckLg />)) : rule.name}
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
