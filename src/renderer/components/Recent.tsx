import { useEffect, useState } from 'react';
import { ConnectionModel } from 'db/models/ConnectionModels';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const RecentList = () => {
  const navigate = useNavigate();

  const [recent, setRecent] = useState<ConnectionModel[]>();
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecent = async () => {
      const newRecent = await window.connections.ipcRenderer.fetch();
      setRecent(newRecent);
    };
    fetchRecent();
  }, []);

  const handleClick = async (id: number) => {
    try {
      await window.connections.ipcRenderer.select(id);
    } catch (e) {
      setAlert(true);
      return;
    }

    navigate('/execute');
  };

  const showAlert = () => {
    return (
      <Modal show={alert} onHide={() => setAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Could not connect to the server. Please check your configuration
          details.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAlert(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <div className="recent-list">
        {recent?.map((connection: ConnectionModel) => {
          const { connectionConfig } = connection;

          let connectionString = '';
          connectionString =
            `${connection.type}://${connectionConfig.username}:` +
            `asdf` +
            `@${connectionConfig.address}:${connectionConfig.port}`;
          return (
            <>
              <button
                className="recent-item"
                type="button"
                onClick={() => handleClick(connection.id)}
              >
                <span>{connection.nickname}</span>
                <span className="recent-item-info">{connectionString}</span>
              </button>
              <hr />
            </>
          );
        })}
      </div>
      {alert && showAlert()}
    </>
  );
};

export default RecentList;
