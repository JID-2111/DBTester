import '../scss/RecentConnections.scss';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ConnectionModel } from 'db/Models';

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
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type of Connection</th>
              <th>Address</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {models.map((value) => {
              return (
                <tr>
                  <Link to="/Execute">
                    <button type="button" className="buttonSelect">
                      <td className="LinkTD">{value.id}</td>
                    </button>
                  </Link>
                  <td>{value.nickname}</td>
                  <td>{value.address}</td>
                  <td>{value.username}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
