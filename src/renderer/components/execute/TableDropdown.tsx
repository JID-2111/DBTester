import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import '../../scss/Execute.scss';

interface ITableDropdownProps {
  activeDb: string;
}

const TableDropdown = ({ activeDb }: ITableDropdownProps) => {
  const [tables, setTables] = useState<string[]>([]);
  const [activeTable, setActiveTable] = useState<string>('Select Table');
  useEffect(() => {
    const fetchTables = async () => {
      const newTables = await window.procedures.ipcRenderer.fetchTables();
      setTables(newTables);
    };
    fetchTables();
  }, [activeDb]);
  const handleClick = async (table: string) => {
    setActiveTable(table);
  };
  const showTables = () => {
    return tables?.map((table) => {
      return (
        <Dropdown.Item key={table} onClick={() => handleClick(table)}>
          {table}
        </Dropdown.Item>
      );
    });
  };
  return (
    <>
      <Dropdown className="dropdown">
        <Dropdown.Toggle variant="primary">{activeTable}</Dropdown.Toggle>
        <Dropdown.Menu>
          {showTables()}
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => handleClick('Test Data')}>
            Test Data
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default TableDropdown;
