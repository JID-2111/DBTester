/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import {
  ConnectionModel,
  ConnectionModelType,
  ConnectionString,
  ManualConnectionConfig,
} from '../../db/Models';
import DBProvider from '../../db/entity/enum';
import '../scss/RecentConnections.scss';

interface IEditProps {
  config: ConnectionModel;
}

interface IEditFields {
  nickname: string;
  type: DBProvider;
  address?: string;
  port?: number;
  username?: string;
  password?: string;
  connectionString?: string;
}

const EditForm = ({ config }: IEditProps) => {
  const [form, setForm] = useState<IEditFields>({
    nickname: config.nickname,
    type: config.type,
  });

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let connectionConfig: ManualConnectionConfig | ConnectionString;
    if (form.connectionString) {
      connectionConfig = {
        config: 'string',
        connectionString: form.connectionString,
      };
    } else {
      connectionConfig = {
        config: 'manual',
        address: form.address!,
        port: form.port!,
        username: form.username!,
        password: form.password!,
      };
    }
    const newConfig: ConnectionModelType = {
      id: config.id,
      nickname: form.nickname,
      type: form.type,
      connectionConfig,
      createdDate: config.createdDate,
    };
    await window.connections.ipcRenderer.update(newConfig);
    handleClose();
  };

  const setField = (
    field: string,
    value: string | DBProvider | boolean | undefined
  ) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Nickname"
                value={form.nickname}
                onChange={(e) => setField('nickname', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Database Type</Form.Label>
              <Form.Control
                as="select"
                value={form.type}
                onChange={(e) => setField('type', e.target.value as DBProvider)}
              >
                <option value={DBProvider.PostgreSQL}>PostgreSQL</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="port">
              <Form.Label>Port</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Port"
                value={form.port}
                onChange={(e) => setField('port', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={form.username}
                onChange={(e) => setField('username', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="connectionString">
              <Form.Label>Connection String</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Connection String"
                value={form.connectionString}
                onChange={(e) => setField('connectionString', e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EditForm;
