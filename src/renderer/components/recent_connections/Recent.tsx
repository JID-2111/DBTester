import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionModel } from '../../../db/Models';
import ServerConnectionErrorModal from '../modals/ServerConnectionErrorModal';

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

  return (
    <>
      <div className="recent-list">
        {recent?.map((connection: ConnectionModel) => {
          const { connectionConfig } = connection;

          let connectionString = '';
          if (connectionConfig.config === 'manual') {
            connectionString =
              `${connection.type}://${connectionConfig.username}:` +
              `asdf` +
              `@${connectionConfig.address}:${connectionConfig.port}`;
          } else if (connectionConfig.config === 'string') {
            connectionString = connectionConfig.connectionString;
          }
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
      {alert && (
        <ServerConnectionErrorModal
          show={alert}
          handleClose={() => setAlert(false)}
        />
      )}
    </>
  );
};

export default RecentList;
