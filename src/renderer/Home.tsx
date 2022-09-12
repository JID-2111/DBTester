import { useEffect, useState } from 'react';
import './App.css';
import ProcedureDropdown from './ProcedureDropdown';

const Home = () => {
  const proceduresDefault = ['test1', 'test2', 'alexiscool'];
  const [procedures, setProcedures] = useState<string[]>();

  useEffect(() => {
    const fetch = async () => {
      const newProcs = await window.procedures.ipcRenderer.fetchProcedures();
      setProcedures(newProcs.get('React'));
    };
    fetch();
  }, []);

  return <ProcedureDropdown procedures={procedures || proceduresDefault} />;
};

export default Home;
