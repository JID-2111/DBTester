import '../scss/RecentConnections.scss';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { ConnectionModel } from '../../db/Models';

const m = new ConnectionModel();
m.id = 1;
m.nickname = 'Connection';
m.address = '123.352.64.7';
m.username = 'User1';
const n = new ConnectionModel();
n.id = 2;
n.nickname = 'Connection2';
n.address = '123.352.64.8';
n.username = 'User2';
const models = [m, n];
const RecentConnections = () => {
  return (
    <div className="RecentWrapper">
      <h1 className="Header">Recent Connections</h1>
      <div className="TDiv">
        <Table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type of Connection</th>
              <th>Address</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {models.map((value) => {
              return (
                <tr key={value.id}>
                  <td className="LinkTD">
                    <Link to="/Execute">
                      <button className="buttonSelect" type="button">
                        {value.id}
                      </button>
                    </Link>
                  </td>
                  <td>{value.nickname}</td>
                  <td>{value.address}</td>
                  <td>{value.username}</td>
                </tr>
              );
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
