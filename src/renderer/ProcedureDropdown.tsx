import { Dropdown } from 'react-bootstrap';

interface IProcedureDropdownProps {
  procedures: string[];
}

const ProcedureDropdown = ({ procedures }: IProcedureDropdownProps) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary">
        View Stored Procedures
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {procedures.map((procedure: any) => {
          return <Dropdown.Item>{procedure}</Dropdown.Item>;
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProcedureDropdown;
