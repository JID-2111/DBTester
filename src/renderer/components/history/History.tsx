import { useEffect, useState } from 'react';
import { Accordion, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../../scss/History.scss';

const History = () => {
  const databases = [''];
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [dbFilter, setDbFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {}, []); // Update procedure history based on filter

  const handleDbFilter = (db: string) => {
    setDbFilter(db);
  };

  const dbDropdown = (
    <Dropdown className="dropdown">
      <Dropdown.Toggle variant="primary">{dbFilter}</Dropdown.Toggle>
      <Dropdown.Menu>
        {databases?.map((database: string) => {
          const dbKey = `database- + ${database}`;
          return (
            <Dropdown.Item key={dbKey} onClick={() => handleDbFilter(database)}>
              {database}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );

  const exampleHistory = (
    <Accordion>
      {Array.from({ length: 10 }).map((_, index) => {
        const key = `procedure-${index}`;
        return (
          <Accordion.Item eventKey={key} key={key}>
            <Accordion.Header>Procedure {index}</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem
              tempore omnis, explicabo sint quae nobis mollitia quis minima
              laboriosam necessitatibus dignissimos dolore ipsum cum ab
              asperiores facere culpa eum saepe!
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="history-wrapper">
        <h1>History</h1>
        <div className="history-filter">
          <h6>Filter By</h6>
          <input
            type="text"
            placeholder="Filter"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <h6>Database</h6>
          {dbDropdown}
          <h6>Date</h6>
        </div>
        <div className="history-list">{exampleHistory}</div>
        <div className="homeButton">
          <Link to="/">
            <Button type="button">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default History;
