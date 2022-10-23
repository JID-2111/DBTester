import { RuleModelType } from 'db/models/RuleModel';
import { CheckLg } from 'react-bootstrap-icons';

interface Iprops {
  Rule: RuleModelType;
}
const AllPass = ({ Rule }: Iprops) => {
  return (
    <tr key={Rule.ruleId}>
      <td>{Rule.name}</td>
      <td>{Rule.ruleId}</td>
      <td>Rule</td>
      <td>{Rule.database}</td>
      <td>All Tests Pass</td>
      <td>
        <CheckLg />
      </td>
    </tr>
  );
};
export default AllPass;
