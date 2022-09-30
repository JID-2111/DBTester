import '../scss/RecentConnections.scss';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { IConnectionStringParameters } from 'connection-string-parser';
import { ConnectionModel } from '../../db/Models';

const RecentConnections = () => {
  const [connect, setConnect] = useState<ConnectionModel[]>([]);
  const [parse, setParsed] = useState<IConnectionStringParameters[]>([]);
  useEffect(() => {
    const getConnections = async () => {
      const connections = await window.connections.ipcRenderer.fetch();
      setConnect(connections);
    };
    const getparsed = async () => {
      const conn = await window.connections.ipcRenderer.fetch();
      const parser: Array<IConnectionStringParameters> = [];
      conn.forEach(async (conne) => {
        if (conne.connectionConfig.config === 'string') {
          const values = await window.util.ipcRenderer.parse(conne);
          if (values !== null) parser.push(values);
        }
      });
      setParsed(parser);
    };
    getConnections();
    getparsed();
  }, []);

  while (connect.length > 5) {
    connect.shift();
  }
  console.log(parse);
  let i = -1;
  return (
    <div className="RecentWrapper">
      <h1 className="Header">Recent Connections</h1>
      <div className="TDiv">
        <Table className="table">
          <thead>
            <tr>
              <th>Nick Name</th>
              <th>Database Type</th>
              <th>Connection type</th>
              <th>Address</th>
              <th>Port</th>
              <th>User Name</th>
            </tr>
          </thead>
          <tbody>
            {connect.map((value) => {
              if (value.connectionConfig.config === 'manual') {
                return (
                  <tr key={value.id}>
                    <td className="LinkTD">
                      <Link to="/Execute">
                        <button className="buttonSelect" type="button">
                          {value.nickname}
                        </button>
                      </Link>
                    </td>
                    <td>{value.type}</td>
                    <td>{value.connectionConfig.config}</td>
                    <td>{value.connectionConfig.address}</td>
                    <td>{value.connectionConfig.port}</td>
                    <td>{value.connectionConfig.username}</td>
                  </tr>
                );
              }
              if (value.connectionConfig.config === 'string') {
                i += 1;
                return (
                  <tr key={value.id}>
                    <td className="LinkTD">
                      <Link to="/Execute">
                        <button className="buttonSelect" type="button">
                          {value.nickname}
                        </button>
                      </Link>
                    </td>
                    <td>{value.type}</td>
                    <td>{value.connectionConfig.config}</td>
                    <td>{parse[i]?.hosts[0].host}</td>
                    <td>{parse[i]?.hosts[0].port}</td>
                    <td>{parse[i]?.username}</td>
                  </tr>
                );
              }

              return null;
            })}
          </tbody>
        </Table>
      </div>
      <div className="toHome">
        <Link to="/" className="link">
          <Button className="HomeButton">Home</Button>
        </Link>
      </div>
    </div>
  );
};
export default RecentConnections;
