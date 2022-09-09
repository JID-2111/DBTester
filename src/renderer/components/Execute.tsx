import Procedures from 'db/Procedures';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcedureDropdown from './ProcedureDropdown';

import '../scss/Execute.scss';

const Execute = () => {
  const proceduresDefault = ['test1', 'test2', 'alexiscool'];
  const [procedures, setProcedures] = useState<string[]>();

  useEffect(() => {
    const fetch = async () => {
      const procs = new Procedures();
      const newProcs = await procs.getProceduresForDB(['React']);
      setProcedures(newProcs.get('React'));
    };

    fetch();
  }, []);

  return (
    <div>
      <h1>Execute Stored Procedures</h1>
      <div className="execute-wrapper">
        <ProcedureDropdown procedures={procedures || proceduresDefault} />
      </div>
      <div className="execute-footer">
        <Link to="/">
          <Button className="home-button">Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Execute;
