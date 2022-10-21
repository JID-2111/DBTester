import RuleEntity from 'db/entity/RuleEntity';
import { UnitTestEntity } from 'db/entity/UnitTestEntity';

interface IProps {
  Rule: RuleEntity;
}

const TestRow = ({ Rule }: IProps) => {
  Rule.unitTests.map((value) => {
    return (
      <tr>
        <td>{value.name}</td>
        <td>{value.id}</td>
        <td>{Rule.database}</td>
        <td>{}</td>
      </tr>
    );
  });
};

export default TestRow;
