import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ConnectionModel } from '../../db/Models';
import '../scss/RecentConnections.scss';
import ReadRow from './ReadRow';
import EditRow from './EditRow';

const RecentConnections = () => {
  const [connect, setConnect] = useState<ConnectionModel[]>([]);
  const [edit, setEdit] = useState<any>();
  const [editdata, setEditData] = useState();
  const getConnections = async () => {
    const connections = await window.connections.ipcRenderer.fetch();
    setConnect(connections);
  };
  useEffect(() => {
    getConnections();
  }, []);
  const handledelete = async (ConnectionID: number) => {
    await window.connections.ipcRenderer.delete(ConnectionID);
    const connections = await window.connections.ipcRenderer.fetch();
    setConnect(connections);
  };
  const handleSelect = async (ConnectionID: number) => {
    await window.connections.ipcRenderer.select(ConnectionID);
  };

  // changes the state to know which row is being edited
  const handleEdit = (Event: Event, Connection: ConnectionModel) => {
    Event?.preventDefault();
    setEdit(Connection.id);
  };

  // updates UI aswell as backend nickname
  const submitForm = async (event) => {
    event.preventDefault();
    const name = event.target.value;
    const model = connect.find((connection) => connection.id === edit);
    if (model !== undefined) {
      model.nickname = name;
      await window.connections.ipcRenderer.update(model);
      setEdit(null);
    }
  };
  // sets state back to read only
  const handlecancel = () => {
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
          <form onSubmit={submitForm}>
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
                          handleCancel={handlecancel}
                          handelChange={submitForm}
                        />
                      ) : (
                        <ReadRow
                          value={value}
                          handleDelete={handledelete}
                          handleSelect={handleSelect}
                          handleEdit={handleEdit}
                        />
                      )}
                    </>
                  );
                })}
              </tbody>
            </Table>
          </form>
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
