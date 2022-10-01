import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DBProvider from '../../db/entity/enum';
import { ConnectionModel } from '../../db/Models';
import '../scss/RecentConnections.scss';

interface INewConnectionForm {
  id: number;
  nickname: string;
  type: DBProvider.PostgreSQL;
  connectionConfig: {
    config: 'manual';
    address: string;
    port: number;
    username: string;
    password: string;
  };
  createdDate: undefined;
  lastUsed: undefined;
}

const EditForm = () => {
  const [form, setForm] = useState<ConnectionModel>(); // Todo: fix this
  const updateField = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });
  };
  const saveConfig = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
  };
  useEffect(() => {});
  return (
    <>
      <div className="EditForm">
        <h1>Edit Connection</h1>
      </div>
      <div>
        <div className="d-flex justify-content-center">
          <Form className="edit-form-wrapper" onSubmit={(e) => saveConfig(e)}>
            <Form.Group className="nickname" controlId="connectionNickname">
              <Form.Label className="form-label">Nickname</Form.Label>
              <Form.Control
                className="form-field"
                value={form.nickname}
                onChange={(e) => {
                  updateField('nickname', e.target.value);
                }}
                type="text"
                placeholder="Enter nickname"
              />
            </Form.Group>
          </Form>
        </div>
        <Link to="/RecentConnections">
          <Button className="">Return</Button>
        </Link>
      </div>
    </>
  );
};

export default EditForm;
