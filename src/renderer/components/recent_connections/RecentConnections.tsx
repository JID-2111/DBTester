import { Link } from 'react-router-dom';
import { Button, Table, Form } from 'react-bootstrap';
import { useState, useEffect, MouseEvent } from 'react';
import { ConnectionModel } from '../../../db/models/ConnectionModels';
import ReadRow from './ReadRow';
import EditRow from './EditRow';

import '../../scss/RecentConnections.scss';

const RecentConnections = () => {
  const [connect, setConnect] = useState<ConnectionModel[]>([]);
  const [edit, setEdit] = useState<unknown>();

  const getConnections = async () => {
    const connections = await window.connections.ipcRenderer.fetch();
    setConnect(connections);
  };
  useEffect(() => {
    getConnections();
  }, []);

  const handleDelete = async (ConnectionID: number) => {
    await window.connections.ipcRenderer.delete(ConnectionID);
    const connections = await window.connections.ipcRenderer.fetch();
    setConnect(connections);
  };
  const handleSelect = async (ConnectionID: number) => {
    await window.connections.ipcRenderer.select(ConnectionID);
  };

  // changes the state to know which row is being edited
  const handleEdit = (Event: MouseEvent, Connection: ConnectionModel) => {
    Event.preventDefault();
    setEdit(Connection.id);
  };

  // updates UI
  const submitForm = async (newval: string) => {
    const model = connect.find((connection) => connection.id === edit);
    if (model !== undefined) {
      model.nickname = newval;
      await window.connections.ipcRenderer.update(model);
    }
    setEdit(null);
  };
  // sets state back to read only
  const handleCancel = () => {
    setEdit(null);
  };
  while (connect.length > 5) {
    connect.shift();
  }
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="recent-wrapper">
        <h1>Recent Connections</h1>
        <div className="d-flex justify-content-center">
          <Form>
            <Table className="table">
              <thead>
                <tr>
                  <th>Nick Name</th>
                  <th>Database Type</th>
                  <th>Address</th>
                  <th>Port</th>
                  <th>User Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {connect.map((value) => {
                  return (
                    <>
                      {edit === value.id ? (
                        <EditRow
                          value={value}
                          toggleReadOnly={handleCancel}
                          handleSubmit={submitForm}
                        />
                      ) : (
                        <ReadRow
                          value={value}
                          handleDelete={handleDelete}
                          handleSelect={handleSelect}
                          handleEdit={handleEdit}
                        />
                      )}
                    </>
                  );
                })}
              </tbody>
            </Table>
          </Form>
        </div>
        <div className="home-btn-footer">
          <Link to="/" className="link">
            <Button className="home-btn">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RecentConnections;
