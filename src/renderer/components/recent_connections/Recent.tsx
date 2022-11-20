import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionModelType } from '../../../db/models/ConnectionModels';
import ServerConnectionErrorModal from '../modals/ServerConnectionErrorModal';
import { formatConnectionString, parseErrorMessage } from '../utils/helpers';

const RecentList = () => {
  const navigate = useNavigate();

  const [recent, setRecent] = useState<ConnectionModelType[]>();
  const [alert, setAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>('');

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

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      const error = parseErrorMessage(e.message);
      setAlertMsg(error);
      setAlert(true);
      return;
    }
    navigate('/execute');
  };

  return (
    <>
      <div className="recent-list">
        {recent?.map((connection: ConnectionModelType) => {
          const connectionString = formatConnectionString(connection);
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
          alertMsg={alertMsg}
          handleClose={() => setAlert(false)}
        />
      )}
    </>
  );
};

export default RecentList;
