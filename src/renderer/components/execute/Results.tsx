import { Table } from 'react-bootstrap';
import RuleEntity from 'db/entity/RuleEntity';
import { UnitTestEntity } from 'db/entity/UnitTestEntity';
import TestRow from './Testrow';

const Results = () => {
  const Rule = new RuleEntity();
  Rule.id = 1;
  Rule.name = 'insert';
  Rule.database = 'React';
  const test1 = new UnitTestEntity();
  test1.id = 1;
  test1.name = 'first test';
  test1.rule = Rule;
  const test2 = new UnitTestEntity();
  test2.id = 2;
  test2.name = 'second test';
  test2.rule = Rule;
  const tests = [test1, test2];
  Rule.unitTests = tests;
  const Rulearray = [Rule];

  return (
    <div className="results-screen">
      <div className="table">
        <div>
          <h1>Exectution Results</h1>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Database</th>
              <th>Type</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {Rulearray.map((Rules) => {
              return (
                <>
                  <tr>RuleRow</tr>
                  <TestRow Rule={Rules} />;
                </>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Results;
