import './App.css';
import ProcedureDropdown from './ProcedureDropdown';

const Home = () => {
  const procedures = ['test1', 'test2', 'alexiscool'];
  return <ProcedureDropdown procedures={procedures} />;
};

export default Home;
