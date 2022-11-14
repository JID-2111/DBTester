import { Dropdown } from 'react-bootstrap';

interface IConnectionDropdownProps {
  allConnections: string[];
  activeConnection: string;
  setActiveConnection: (database: string) => void;
}

const ConnectionDropdown = ({
  allConnections,
  activeConnection,
  setActiveConnection,
}: IConnectionDropdownProps) => {
  return (
    <div>
      <Dropdown className="dropdown">
        <Dropdown.Toggle variant="primary">{activeConnection}</Dropdown.Toggle>
        <Dropdown.Menu>
          {allConnections.map((item) => {
            return (
              <Dropdown.Item
                key={item}
                onClick={() => setActiveConnection(item)}
              >
                {item}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ConnectionDropdown;
