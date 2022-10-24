import { UnitTestType } from 'db/models/UnitTestModels';
import { useEffect, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import ConditionForm from './ConditionForm';
import ConditionList from './ConditionList';

interface IConditionContainerProps {
  conditionList: Partial<UnitTestType>[];
  setConditionList: (c: Partial<UnitTestType>[]) => void;
}

const ConditionContainer = ({
  conditionList,
  setConditionList,
}: IConditionContainerProps) => {
  const [tables, setTables] = useState<string[]>();
  const [currTable, setCurrTable] = useState<string>('select table');

  const addCondition = (condition: Partial<UnitTestType>) => {
    setConditionList(conditionList.concat(condition));
  };

  useEffect(() => {
    const getTables = async () => {
      const fetchedTables = await window.procedures.ipcRenderer.fetchTables();
      setTables(fetchedTables);
    };
    getTables();
  }, []);

  return (
    <Col className="condition-box">
      <Row className="d-flex">
        <Col md="auto">
          <h4>Add Test Conditions</h4>
        </Col>
        <Col md="auto">
          <Row>
            <Dropdown className="operation-dropdown">
              <Dropdown.Toggle variant="primary">{currTable}</Dropdown.Toggle>
              <Dropdown.Menu>
                {tables &&
                  tables.map((table) => {
                    const tableKey = `table- + ${table}`;
                    return (
                      <Dropdown.Item
                        key={tableKey}
                        onClick={() => setCurrTable(table)}
                      >
                        {table}
                      </Dropdown.Item>
                    );
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        </Col>
      </Row>
      {currTable !== 'select table' && (
        <ConditionForm addCondition={addCondition} table={currTable} />
      )}
      <ConditionList
        conditionList={conditionList}
        setConditionList={setConditionList}
      />
    </Col>
  );
};

export default ConditionContainer;
