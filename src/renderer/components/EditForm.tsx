import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ConnectionModel } from '../../db/Models';
import '../scss/RecentConnections.scss';
import NewConnectionForm from './NewConnectionForm';

interface IEditProps {
  config: ConnectionModel;
}

const EditForm = ({ config }: IEditProps) => {
  const form = useState<ConnectionModel>(config);
  useEffect(() => {});
  return (
    <>
      <div className="EditForm">
        <h1>Edit Connection</h1>
      </div>
      {React.cloneElement(<NewConnectionForm />, {
        defaultForm: { ...form },
      })}
      <div className="home-btn-footer">
        <Button className="home-btn">Home</Button>
      </div>
    </>
  );
};

export default EditForm;
