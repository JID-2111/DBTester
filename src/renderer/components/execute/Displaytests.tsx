import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';

interface Iprops {
  Rule: RuleModelType;
}
const Displaytests = ({ Rule }: Iprops) => {
  let i = 0;
  const j = Rule.unitTests.length;
  Rule.unitTests.forEach((test: UnitTestType) => {
    if (test.result === true) {
      i += 1;
    }
  });
  return (
    <>
      <tr key={Rule.ruleId}>
        <td>{Rule.name}</td>
        <td>{Rule.ruleId}</td>
        <td>{Rule.database}</td>
        <td>Rule</td>
        <td>
          {i} of {j} tests pass
        </td>
        {i === 0 ? <td>No passing tests</td> : <td>Not all tests pass</td>}
      </tr>
      {Rule.unitTests.map((test) => {
        return (
          <tr key={test.id}>
            <td>{test.name}</td>
            <td>{test.id}</td>
            <td>{Rule.database}</td>
            <td>UnitTest</td>
            <td>{test.result}</td>
            {test.result ? (
              <td>test passed</td>
            ) : (
              <td>
                <button type="button">view test</button>
              </td>
            )}
          </tr>
        );
      })}
    </>
  );
};
export default Displaytests;
