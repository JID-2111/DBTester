import Procedures from 'db/Procedures';
import { useEffect, useState } from 'react';
import './App.css';
import ProcedureDropdown from './ProcedureDropdown';

const Home = () => {
  const proceduresDefault = ['test1', 'test2', 'alexiscool'];
  const [procedures, setProcedures] = useState<any[]>();

  useEffect(() => {
    const fetch = async () => {
      const procs = new Procedures();
      const newProcs = await procs.getProceduresForDB(['React']);
      setProcedures(newProcs.get('React'));
    };

    fetch();
  }, []);

  return <ProcedureDropdown procedures={procedures || proceduresDefault} />;
};

export default Home;
