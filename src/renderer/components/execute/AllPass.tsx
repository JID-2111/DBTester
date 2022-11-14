import { RuleModelType } from 'db/models/RuleModel';
import { CheckLg } from 'react-bootstrap-icons';

interface Iprops {
  Rule: RuleModelType;
}
const AllPass = ({ Rule }: Iprops) => {
  return (
    <tr key={Rule.id}>
      <td>{Rule.name}</td>
      <td>{Rule.id}</td>
      <td>{Rule.database}</td>
      <td>Rule</td>
      <td>All Tests Pass</td>
      <td>
        <CheckLg />
      </td>
    </tr>
  );
};
export default AllPass;
