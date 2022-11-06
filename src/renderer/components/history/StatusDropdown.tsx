import { Dropdown } from 'react-bootstrap';

interface IStatusDropdownProps {
  successFilter: string;
  handleStatusFilter: (status: string) => void;
}

const StatusDropdown = ({
  successFilter,
  handleStatusFilter,
}: IStatusDropdownProps) => {
  return (
    <Dropdown className="dropdown">
      <Dropdown.Toggle variant="primary">{successFilter}</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item key="All" onClick={() => handleStatusFilter('All')}>
          All
        </Dropdown.Item>
        <Dropdown.Item
          key="Success"
          onClick={() => handleStatusFilter('Success')}
        >
          Success
        </Dropdown.Item>
        <Dropdown.Item key="Fail" onClick={() => handleStatusFilter('Fail')}>
          Fail
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default StatusDropdown;
