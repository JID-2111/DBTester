import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../../scss/History.scss';
import { ExecutionModelType } from 'db/models/ExecutionModel';
import { RuleModelType } from 'db/models/RuleModel';
import { UnitTestType } from 'db/models/UnitTestModels';

import { Trash, Upload } from 'react-bootstrap-icons';
import StatusDropdown from './StatusDropdown';
import ConnectionDropdown from './ConnectionDropdown';

export interface Flattened {
  timestamp: Date;
  procedure: string;
  database: string;
  connection?: string;
  dbType?: string;
  response: boolean;
  execution: ExecutionModelType;
  parameters: string[];
}

const History = () => {
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [activeConnection, setActiveConnection] = useState<string>('All');
  const [allConnections, setAllConnections] = useState<string[]>(['All']);
  const [successFilter, setSuccessFilter] = useState<string>('All');
  const [executions, setExecutions] = useState<ExecutionModelType[]>([]);
  const [rows, setRows] = useState<Flattened[]>([]);
  const [showRows, setShowRows] = useState<Flattened[]>([]);

  const navigate = useNavigate();
  const fetchExecutions = async () => {
    const execution: ExecutionModelType[] =
      await window.executions.ipcRenderer.fetchAll();
    setExecutions(execution);
  };
  useEffect(() => {
    fetchExecutions();
  }, []); // Update procedure history based on filter

  useEffect(() => {
    const result: Flattened[] = [];
    const tempConnections: Set<string> = new Set(['All']);
    executions.forEach((ex: ExecutionModelType) => {
      ex.rules.forEach((rule: RuleModelType) => {
        rule.unitTests.forEach((test: UnitTestType) => {
          if (ex.connection) {
            tempConnections.add(ex.connection?.nickname);
          }
          const flat: Flattened = {
            timestamp: ex.timestamp,
            procedure: rule.procedure,
            database: rule.database,
            connection: ex.connection?.nickname,
            dbType: ex.connection?.type,
            response: test.result ?? false,
            execution: ex,
            parameters: rule.parameters,
          };
          result.push(flat);
        });
      });
    });
    setRows(result);
    setShowRows(result);
    setAllConnections([...tempConnections]);
  }, [executions, activeConnection]);

  useEffect(() => {
    let tempRows: Flattened[] = rows;

    if (activeQuery) {
      tempRows = tempRows.filter((row) => row.procedure.includes(activeQuery));
    }
    if (activeConnection !== 'All') {
      tempRows = tempRows.filter(
        (row) => row.connection && row.connection.includes(activeConnection)
      );
    }
    if (successFilter !== 'All') {
      if (successFilter === 'Success') {
        tempRows = tempRows.filter((row) => row.response);
      } else if (successFilter === 'Fail') {
        tempRows = tempRows.filter((row) => !row.response);
      }
    }
    setShowRows(tempRows);
  }, [activeQuery, activeConnection, successFilter, rows]);

  const updateActiveConnection = (database: string) => {
    setActiveConnection(database);
  };

  const handleStatusFilter = (status: string) => {
    setSuccessFilter(status);
  };

  const handleQueryString = (query: string) => {
    setActiveQuery(query);
  };

  const handleLoadClick = async (ex: ExecutionModelType) => {
    if (ex.connection) {
      await window.connections.ipcRenderer.select(ex.connection.id);
      navigate('/execute', { state: ex });
    }
  };

  const handleDeleteClick = async (ex: ExecutionModelType) => {
    if (ex.id) await window.executions.ipcRenderer.delete(ex.id);
    fetchExecutions();
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
            <h5>Filter by connection</h5>
            <div className="search-button">
              <ConnectionDropdown
                allConnections={allConnections}
                activeConnection={activeConnection}
                setActiveConnection={updateActiveConnection}
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
                <th>Procedure</th>
                <th>Connection</th>
                <th>Type</th>
                <th>Response</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {showRows.map((row: Flattened) => {
                const d = new Date(row.timestamp);
                const date = d.toLocaleDateString();
                const time = d.toLocaleTimeString('en-US');

                return (
                  <tr>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>{row.procedure}</td>
                    <td>{row.connection}</td>
                    <td>{row.dbType}</td>
                    <td>{row.response ? 'Success' : 'Fail'}</td>
                    <td>{Math.floor(Math.random() * 10)} ms</td>
                    <Button
                      size="sm"
                      type="button"
                      className="rerun-button"
                      onClick={() => handleLoadClick(row.execution)}
                    >
                      <Upload />
                    </Button>
                    <Button onClick={() => handleDeleteClick(row.execution)}>
                      <Trash />
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

History.defaultProps = {
  connection: '',
};

export default History;
