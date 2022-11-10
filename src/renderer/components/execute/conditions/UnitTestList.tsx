import { UnitTestType } from 'db/models/UnitTestModels';
import { Container } from 'react-bootstrap';
import UnitTest from './UnitTest';

interface IUnitTestListProps {
  conditionList: Partial<UnitTestType>[];
  deleteCondition: (c: Partial<UnitTestType>) => void;
}

const UnitTestList = ({
  conditionList,
  deleteCondition,
}: IUnitTestListProps) => {
  return (
    <Container
      fluid
      className={`p-0 justify-content-center ${
        conditionList.length === 0 ? 'd-flex' : ''
      }`}
    >
      {conditionList.length > 0 ? (
        conditionList.map((condition, idx) => {
          return (
            <UnitTest
              condition={condition}
              deleteCondition={deleteCondition}
              key={condition.id || `cond ${idx}`}
            />
          );
        })
      ) : (
        <span>No Unit Tests Yet!</span>
      )}
    </Container>
  );
};

export default UnitTestList;
