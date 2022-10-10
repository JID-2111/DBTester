import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import '../../scss/App.scss';

interface IDBDropdownProps {
  activeDb: string;
  updateDb: (database: string) => void;
}

const DBDropdown = ({ activeDb, updateDb }: IDBDropdownProps) => {
  const [databases, setDatabases] = useState<string[]>(['']);

  useEffect(() => {
    const fetchDBs = async () => {
      const dbs = await window.procedures.ipcRenderer.fetchDatabases();
      setDatabases(dbs);
    };
    fetchDBs();
  }, []);

  const handleClick = async (database: string) => {
    updateDb(database);
    await window.connections.ipcRenderer.switch(database);
  };

  return (
    <Dropdown className="dropdown">
      <Dropdown.Toggle variant="primary">{activeDb}</Dropdown.Toggle>

      <Dropdown.Menu>
        {databases.map((database: string) => {
          const dbKey = `database- + ${database}`;
          return (
            <Dropdown.Item key={dbKey} onClick={() => handleClick(database)}>
              {database}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DBDropdown;
