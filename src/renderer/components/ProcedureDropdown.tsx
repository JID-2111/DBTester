import { Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const ProcedureDropdown = () => {
  const defaultVal = 'View Stored Procedures';
  const [value, setValue] = useState<string>(defaultVal);

  const proceduresDefault = ['test1', 'test2', 'alexiscool'];
  const [procedures, setProcedures] = useState<string[]>();

  // useEffect(() => {}, []);

  const fetch = async () => {
    const newProcs = await window.procedures.ipcRenderer.fetchProcedures();
    setProcedures(newProcs.get('React'));
  };
  fetch();

  return (
    <Dropdown className="dropdown">
      <Dropdown.Toggle variant="primary">{value}</Dropdown.Toggle>

      <Dropdown.Menu onClick={() => fetch()}>
        {(procedures || proceduresDefault).map((procedure: string) => {
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
