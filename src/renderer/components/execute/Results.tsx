import { Table, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import AllPass from './AllPass';
import Displaytests from './Displaytests';
import '../../scss/results.scss';

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
        <Table className="table">
          <thead>
            <tr key={results.id}>
              <th>Name</th>
              <th>ID</th>
              <th>Database</th>
              <th>Type</th>
              <th>Result</th>
              <th> Message </th>
            </tr>
          </thead>
          <tbody>
            {results.rules.map((value) => {
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
