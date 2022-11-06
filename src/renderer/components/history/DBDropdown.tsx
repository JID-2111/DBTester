import { Dropdown } from 'react-bootstrap';

interface IDBDropdownProps {
  allDatabases: string[];
  activeDb: string;
  updateDb: (database: string) => void;
}

const DBDropdown = ({ allDatabases, activeDb, updateDb }: IDBDropdownProps) => {
  return (
    <div>
      <Dropdown className="dropdown">
        <Dropdown.Toggle variant="primary">{activeDb}</Dropdown.Toggle>
        <Dropdown.Menu>
          {allDatabases.map((item) => {
            return (
              <Dropdown.Item key={item} onClick={() => updateDb(item)}>
                {item}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DBDropdown;
