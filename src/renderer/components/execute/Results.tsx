import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { TableTestType, RowTestType } from 'db/models/UnitTestModels';
import {
  RowNumberOperations,
  RecordMatches,
  UnitTestOperations,
  OutputFormat,
  TableGenericOperations,
} from 'db/entity/enum';
import AllPass from './AllPass';
import Displaytests from './Displaytests';
import '../../scss/results.scss';

const Results = () => {
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
    id: 1,
    expectedRecordMatches: 0,
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
    id: 2,
    expectedRecordMatches: RecordMatches.TABLE_ROWS,
    total: true,
    expectedNumRecords: 10,
    table: 'accounts',
    result: true,
    format: OutputFormat.PLAIN,
    output: '',
    rule: rule1,
  };

  const test3: TableTestType = {
    operation: TableGenericOperations.COUNT,
    level: UnitTestOperations.TableGenericOperations,
    name: 'test3',
    id: 3,
    expectedRecordMatches: RecordMatches.TABLE_ROWS,
    total: false,
    expectedNumRecords: 2,
    table: 'accounts',
    result: true,
    format: OutputFormat.PLAIN,
    output: '',
    rule: rule1,
  };

  const test4: RowTestType = {
    operation: RowNumberOperations.LT,
    level: UnitTestOperations.RowNumberOperations,
    name: 'test4',
    id: 4,
    expectedRecordMatches: RecordMatches.TABLE_ROWS,
    total: true,
    column: 'balance',
    expectedNumRecords: 2,
    table: 'accounts',
    result: false,
    format: OutputFormat.PLAIN,
    output: '',
    value: '200',
    rule: rule2,
  };

  const test5: RowTestType = {
    operation: RowNumberOperations.EQ,
    level: UnitTestOperations.RowNumberOperations,
    name: 'test5',
    id: 5,
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
  const method = async (value: ExecutionModelType) => {
    const results = await window.executions.ipcRenderer.checkPassFail(value);
    console.log(results);
  };
  method(execution);
  const passFail = (Rule: RuleModelType): boolean => {
    let pass = true;
    // eslint-disable-next-line array-callback-return
    Rule.unitTests.map((test) => {
      if (test.result === false) {
        pass = false;
      }
    });
    return pass;
  };

  return (
    <div className="results-screen">
      <div className="table">
        <div>
          <h1>Exectution Results</h1>
        </div>
        <Table>
          <thead>
            <tr key={execution.id}>
              <th>Name</th>
              <th>ID</th>
              <th>Database</th>
              <th>Type</th>
              <th>Result</th>
              <th> Message </th>
            </tr>
          </thead>
          <tbody>
            {execution.rules.map((value) => {
              return (
                <>
                  {passFail(value) ? (
                    <AllPass Rule={value} />
                  ) : (
                    <Displaytests Rule={value} />
                  )}
                </>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div className="homeButton">
        <Link to="/">
          <Button type="button">Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Results;
