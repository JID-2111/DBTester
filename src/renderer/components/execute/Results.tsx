import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';
import {
  TableGenericOperations,
  UnitTestOperations,
  OutputFormat,
} from 'db/entity/enum';
import AllPass from './AllPass';
import Displaytests from './Displaytests';
import '../../scss/results.scss';

interface Iprops {
  result: ExecutionModelType;
}
const Results = ({ result }: Iprops) => {
  // eslint-disable-next-line no-param-reassign
  result = {
    id: 1,
    timestamp: new Date(),
    rules: [],
  };
  const Rule1: RuleModelType = {
    name: 'Rule 1',
    ruleId: 0,
    database: 'react',
    testData: '',
    unitTests: [],
    execution: result,
    procedure: '',
    parameters: [],
  };
  const Rule2: RuleModelType = {
    name: 'Rule 2',
    ruleId: 1,
    database: 'react',
    testData: '',
    unitTests: [],
    execution: result,
    procedure: '',
    parameters: [],
  };
  const test1: UnitTestType = {
    id: 111,
    name: 'testInsert',
    result: true,
    level: UnitTestOperations.TableGenericOperations,
    expectedRecordMatches: 0,
    total: false,
    expectedNumRecords: 0,
    table: '',
    operation: TableGenericOperations.EXISTS,
    format: OutputFormat.JSON,
    output: '',
    rule: Rule1,
  };
  const test2: UnitTestType = {
    id: 222,
    name: 'testDelete',
    result: true,
    level: UnitTestOperations.TableGenericOperations,
    expectedRecordMatches: 0,
    total: false,
    expectedNumRecords: 0,
    table: '',
    operation: TableGenericOperations.EXISTS,
    format: OutputFormat.JSON,
    output: '',
    rule: Rule1,
  };
  const test3: UnitTestType = {
    id: 333,
    name: 'testCall',
    result: false,
    level: UnitTestOperations.TableGenericOperations,
    expectedRecordMatches: 0,
    total: false,
    expectedNumRecords: 0,
    table: '',
    operation: TableGenericOperations.EXISTS,
    format: OutputFormat.JSON,
    output: '',
    rule: Rule2,
  };
  const test4: UnitTestType = {
    id: 444,
    name: 'testUpdate',
    result: false,
    level: UnitTestOperations.TableGenericOperations,
    expectedRecordMatches: 0,
    total: false,
    expectedNumRecords: 0,
    table: '',
    operation: TableGenericOperations.EXISTS,
    format: OutputFormat.JSON,
    output: '',
    rule: Rule2,
  };
  const test5: UnitTestType = {
    id: 555,
    name: 'testUpdate',
    result: true,
    level: UnitTestOperations.TableGenericOperations,
    expectedRecordMatches: 0,
    total: false,
    expectedNumRecords: 0,
    table: '',
    operation: TableGenericOperations.EXISTS,
    format: OutputFormat.JSON,
    output: '',
    rule: Rule2,
  };
  result.rules = [Rule1, Rule2];
  Rule1.unitTests = [test1, test2];
  Rule2.unitTests = [test3, test4, test5];

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
        <Table className="table">
          <thead>
            <tr key={result.id}>
              <th>Name</th>
              <th>ID</th>
              <th>Database</th>
              <th>Type</th>
              <th>Result</th>
              <th> Message </th>
            </tr>
          </thead>
          <tbody>
            {result.rules.map((value) => {
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
