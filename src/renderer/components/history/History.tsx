import { useEffect, useState } from 'react';
import { Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../../scss/History.scss';

const History = () => {
  const [filter, setFilter] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {}, []); // Update procedure history based on filter

  const showHistory = () => {
    return (
      <Accordion defaultActiveKey="0" className="history-list">
        {history.map((procedure, id) => {
          return (
            <Accordion.Item eventKey="0">
              <Accordion.Header>{procedure.name}</Accordion.Header>
              <Accordion.Body>
                <p>{procedure.description}</p>
                <p>{procedure.date}</p>
                <p>{procedure.time}</p>
                <p>{procedure.user}</p>
                <p>{procedure.database}</p>
                <p>{procedure.query}</p>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  };

  return (
    <>
      <div className="history-header">
        <h1>History</h1>
      </div>
      <div className="history-filter">
        <div className="history-filter">
          <h6>Search</h6>
          <input
            type="text"
            placeholder="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="history-filter">
            {/* Filter / Sort by db, date, or type */}
          </div>
        </div>
      </div>
      <div className="history-list">{showHistory()}</div>
      <div className="homeButton">
        <Link to="/">
          <Button type="button">Home</Button>
        </Link>
      </div>
    </>
  );
};

export default History;
