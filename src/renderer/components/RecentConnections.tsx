import '../scss/RecentConnections.scss';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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
            <tr>
              <Link to="/Execute">
                <button className="buttonSelect" type="button">
                  <td className="LinkTD">Connection1</td>
                </button>
              </Link>
              <td>PostgreSQL</td>
              <td>123.234.32.4</td>
              <td>User1</td>
            </tr>
            <tr>
              <Link to="/Execute">
                <button className="buttonSelect" type="button">
                  <td className="LinkTD">Connection2</td>
                </button>
              </Link>
              <td>MySQL</td>
              <td>123.234.32.17</td>
              <td>User2</td>
            </tr>
            <tr>
              <Link to="/Execute">
                <button className="buttonSelect" type="button">
                  <td className="LinkTD">Connection3</td>
                </button>
              </Link>
              <td>Oracle</td>
              <td>456.789.18.13</td>
              <td>User3</td>
            </tr>
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
