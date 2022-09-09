import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

interface IProcedureDropdownProps {
  procedures: string[];
}

const ProcedureDropdown = ({ procedures }: IProcedureDropdownProps) => {
  const defaultVal = 'View Stored Procedures';
  const [value, setValue] = useState<string>(defaultVal);
  return (
    <Dropdown className="dropdown">
      <Dropdown.Toggle variant="primary">{value}</Dropdown.Toggle>

      <Dropdown.Menu>
        {procedures.map((procedure: string) => {
          return (
            <Dropdown.Item onClick={() => setValue(procedure)}>
              {procedure}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProcedureDropdown;
