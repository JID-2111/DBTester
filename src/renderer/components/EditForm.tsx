import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ConnectionModel, ConnectionModelType } from '../../db/Models';
import '../scss/RecentConnections.scss';

const EditForm = (db: ConnectionModel) => {
  const [value, setValue] = useState<ConnectionModel>(db);
  useEffect(() => {
    console.log(db);
  });
  return (
    <>
      <div className="EditForm">
        <h1>Edit Connection</h1>
      </div>
      <div>
        <Link to="/">
          <Button className="">Return</Button>
        </Link>
      </div>
    </>
  );
};

export default EditForm;
