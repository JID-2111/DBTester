import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Archive, Link45deg, Plus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import '../scss/Home.scss';

const Home = () => {
  const [verify, setVerify] = useState<boolean>(false);

  useEffect(() => {
    const v = async () => {
      const currConnected = await window.connections.ipcRenderer.verify();
      setVerify(currConnected);
    };
    v();
  });

  const handleClick = async () => {
    await window.connections.ipcRenderer.disconnect();
    setVerify(false);
  };

  return (
    <div>
      <h1>DB Tester</h1>
      <div className="launch-wrapper">
        <Link to="/">
          <Button variant="secondary" className="launch-button">
            <Plus className="icon" height="2em" width="2em" />
            <h2>New Connection</h2>
          </Button>
        </Link>
        <Link to="/RecentConnection">
          <Button variant="secondary" className="launch-button">
            <Link45deg className="icon" height="2em" width="2em" />
            <h2>Connect to Existing</h2>
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" className="launch-button">
            <Archive className="icon" height="2em" width="2em" />
            <h2>View History</h2>
          </Button>
        </Link>
        {verify && (
          <div>
            <Link to="/execute">
              <Button className="execute-button">Execute</Button>
            </Link>
            <Button onClick={() => handleClick()} className="disconnect-button">
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
