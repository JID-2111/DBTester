import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionModel } from '../../../db/models/ConnectionModels';
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
          connectionString =
            `${connection.type}://${connectionConfig.username}:` +
            `****` +
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
