import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../../scss/History.scss';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';

import StatusDropdown from './StatusDropdown';
import DBDropdown from './DBDropdown';

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
    const fetchExecutions = async () => {
      const execution: ExecutionModelType[] =
        await window.executions.ipcRenderer.fetchAll();
      setExecutions(execution);
    };
    fetchExecutions();
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
                      load
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
