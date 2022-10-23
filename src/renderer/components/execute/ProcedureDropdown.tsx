import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import '../../scss/Execute.scss';
import Modal from '../utils/Modal';

interface IProcedureDropdownProps {
  activeDb: string;
  activeProcedure: string;
  setActiveProcedure: (procedure: string) => void;
  setCode: (code: string) => void;
}

const ProcedureDropdown = ({
  activeDb,
  activeProcedure,
  setActiveProcedure,
  setCode,
}: IProcedureDropdownProps) => {
  const proceduresDefault = ['test1', 'test2', 'test3'];

  const [procedures, setProcedures] = useState<string[]>();
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    const fetchProcs = async () => {
      const newProcs = await window.procedures.ipcRenderer.fetchProcedures();
      setProcedures(newProcs.get(activeDb));
    };
    fetchProcs();
  }, [activeDb]);

  const handleClick = async (procedure: string) => {
    setActiveProcedure(procedure);

    try {
      const code = await window.procedures.ipcRenderer.fetchContent(procedure);
      setCode(code);
    } catch (e) {
      setAlert(true);
    }
  };

  const showAlert = () => {
    return (
      <>
        <Modal
          show={alert}
          handleClose={() => setAlert(false)}
          title="Error"
          modalBody="Could not load the procedure."
        />
      </>
    );
  };

  return (
    <>
      <Dropdown className="dropdown">
        <Dropdown.Toggle variant="primary">{activeProcedure}</Dropdown.Toggle>

        <Dropdown.Menu>
          {(procedures || proceduresDefault).map((procedure: string) => {
            const procKey = `procedure-${procedure}`;
            return (
              <Dropdown.Item
                key={procKey}
                onClick={() => handleClick(procedure)}
              >
                {procedure}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      {alert && showAlert()}
    </>
  );
};

export default ProcedureDropdown;
