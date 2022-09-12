import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

interface IProcedureDropdownProps {
  procedures: string[];
}

const ProcedureDropdown = ({ procedures }: IProcedureDropdownProps) => {
  const defaultVal = 'View Stored Procedures';
  const [value, setValue] = useState<string>(defaultVal);
  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary">{value}</Dropdown.Toggle>

      <Dropdown.Menu>
        {procedures.map((procedure: any) => {
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
