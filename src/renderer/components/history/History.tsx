import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../../scss/History.scss';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import {
  TableTestType,
  RowTestType,
  UnitTestType,
} from 'db/models/UnitTestModels';
import {
  TableGenericOperations,
  UnitTestOperations,
  OutputFormat,
  RecordMatches,
  RowNumberOperations,
} from 'db/entity/enum';
import StatusDropdown from './StatusDropdown';
import DBDropdown from './DBDropdown';

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
  procedure: 'procedure2',
  parameters: [],
};

const rule2: RuleModelType = {
  name: 'rule2',
  ruleId: 1,
  database: 'KPMG',
  testData: '',
  unitTests: [],
  execution,
  procedure: 'procedure1',
  parameters: [],
};
const test1: TableTestType = {
  operation: TableGenericOperations.EXISTS,
  level: UnitTestOperations.TableGenericOperations,
  name: 'test1',
  expectedRecordMatches: RecordMatches.TABLE_ROWS,
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
  expectedRecordMatches: RecordMatches.TABLE_ROWS,
  total: true,
  expectedNumRecords: 10,
  table: 'accounts',
  result: false,
  format: OutputFormat.PLAIN,
  output: '',
  rule: rule1,
};

const test3: TableTestType = {
  operation: TableGenericOperations.COUNT,
  level: UnitTestOperations.TableGenericOperations,
  name: 'test3',
  expectedRecordMatches: RecordMatches.TABLE_ROWS,
  total: false,
  expectedNumRecords: 2,
  table: 'accounts',
  result: false,
  format: OutputFormat.PLAIN,
  output: '',
  rule: rule1,
};

const test4: RowTestType = {
  operation: RowNumberOperations.LT,
  level: UnitTestOperations.RowNumberOperations,
  name: 'test4',
  expectedRecordMatches: RecordMatches.TABLE_ROWS,
  total: true,
  column: 'balance',
  expectedNumRecords: 2,
  table: 'accounts',
  result: true,
  format: OutputFormat.PLAIN,
  output: '',
  value: '200',
  rule: rule2,
};

const test5: RowTestType = {
  operation: RowNumberOperations.EQ,
  level: UnitTestOperations.RowNumberOperations,
  name: 'test5',
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

const test9: RowTestType = {
  operation: RowNumberOperations.EQ,
  level: UnitTestOperations.RowNumberOperations,
  name: 'test5',
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
const test6: RowTestType = {
  operation: RowNumberOperations.EQ,
  level: UnitTestOperations.RowNumberOperations,
  name: 'test5',
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
const test7: RowTestType = {
  operation: RowNumberOperations.EQ,
  level: UnitTestOperations.RowNumberOperations,
  name: 'test5',
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
const test8: RowTestType = {
  operation: RowNumberOperations.EQ,
  level: UnitTestOperations.RowNumberOperations,
  name: 'test5',
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
rule2.unitTests = [test4, test5, test6, test7, test8, test9];
execution.rules = [rule1, rule2];

interface Flattened {
  timestamp: Date;
  procedure: string;
  database: string;
  dbType?: string;
  response: boolean;
}

const History = () => {
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [activeDb, setActiveDb] = useState<string>('All');
  const [allDatabases, setallDatabases] = useState<string[]>([]);
  const [successFilter, setSuccessFilter] = useState<string>('All');
  const [executions, setExecutions] = useState<ExecutionModelType[]>([]);
  const [rows, setRows] = useState<Flattened[]>([]);
  const [showRows, setShowRows] = useState<Flattened[]>([]);

  useEffect(() => {
    setallDatabases(['All', 'Test1', 'Test2', 'Test3', 'React', 'KPMG']);
    setExecutions([execution]);
  }, []); // Update procedure history based on filter

  useEffect(() => {
    const result: Flattened[] = [];
    executions.forEach((ex: ExecutionModelType) => {
      ex.rules.forEach((rule: RuleModelType) => {
        rule.unitTests.forEach((test: UnitTestType) => {
          const flat: Flattened = {
            timestamp: ex.timestamp,
            procedure: rule.procedure,
            database: rule.database,
            dbType: ex.connection?.type,
            response: test.result,
          };
          result.push(flat);
        });
      });
    });
    setRows(result);
    setShowRows(result);
  }, [executions]);

  useEffect(() => {
    let tempRows: Flattened[] = rows;

    if (activeQuery) {
      tempRows = tempRows.filter((row) => row.procedure.includes(activeQuery));
    }
    if (activeDb !== 'All') {
      tempRows = tempRows.filter((row) => row.database.includes(activeDb));
    }
    if (successFilter !== 'All') {
      if (successFilter === 'Success') {
        tempRows = tempRows.filter((row) => row.response);
      } else if (successFilter === 'Fail') {
        tempRows = tempRows.filter((row) => !row.response);
      }
    }
    setShowRows(tempRows);
  }, [activeQuery, activeDb, successFilter, rows]);

  const updateDb = (database: string) => {
    setActiveDb(database);
  };

  const handleStatusFilter = (status: string) => {
    setSuccessFilter(status);
  };

  const handleQueryString = (query: string) => {
    setActiveQuery(query);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="history-wrapper">
        <h1>Procedure History</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search for a procedure"
            value={activeQuery}
            onChange={(e) => handleQueryString(e.target.value)}
          />
        </div>
        <div className="filters">
          <div className="filter">
            <h5>Filter by database</h5>
            <div className="search-button">
              <DBDropdown
                allDatabases={allDatabases}
                activeDb={activeDb}
                updateDb={updateDb}
              />
            </div>
          </div>
          <div className="filter">
            <h5>Filter status</h5>
            <div className="pass-fail-switch">
              <StatusDropdown
                successFilter={successFilter}
                handleStatusFilter={handleStatusFilter}
              />
            </div>
          </div>
        </div>
        <div className="table-container">
          <Table responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Procedure Name</th>
                <th>Database</th>
                <th>Type</th>
                <th>Response</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {showRows.map((row: Flattened) => {
                const d = new Date(row.timestamp);
                const date = `${d.getMonth()}-${d.getDay()}-${d.getFullYear()}`;
                const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

                return (
                  <tr>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>{row.procedure}</td>
                    <td>{row.database}</td>
                    <td>{row.dbType}</td>
                    <td>{row.response ? 'Success' : 'Fail'}</td>
                    <td>5 mins</td>
                    <Button size="sm" type="button" className="rerun-button">
                      run
                    </Button>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="home-button">
          <Link to="/">
            <Button type="button">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default History;
