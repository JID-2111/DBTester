import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ConnectionModel } from '../../db/Models';
import '../scss/RecentConnections.scss';
import NewConnectionForm from './NewConnectionForm';

interface IEditProps {
  config: ConnectionModel;
}

const EditForm = ({ config }: IEditProps) => {
  const form = useState<ConnectionModel>(config);
  const [show, setShow] = useState<boolean>(false);
  return (
    <div>
      <Button
        variant="primary"
        className="EditButton"
        onClick={() => setShow(true)}
      />
      {show && (
        <div className="overlay position-absolute">
          <div>
            <h1>Edit Connection</h1>
          </div>
          {React.cloneElement(<NewConnectionForm />, {})}
          <Button
            variant="primary"
            className="EditButton"
            onClick={() => setShow(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EditForm;
