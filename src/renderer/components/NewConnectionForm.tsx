/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  ConnectionInputType,
  ConnectionString,
  ManualConnectionConfig,
} from 'db/models/ConnectionModels';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import DBProvider from '../../db/entity/enum';

interface INewConnectionForm {
  nickname: string;
  type: DBProvider;
  database?: string;
  address?: string;
  port?: number;
  username?: string;
  password?: string;
  remember: boolean;
  connectionString?: string;
}

interface INewConnectionErrors {
  nickname?: string;
  database?: string;
  type?: string;
  address?: string;
  port?: string;
  username?: string;
  password?: string;
  connectionString?: string;
}

const NewConnectionForm = () => {
  const defaultForm: INewConnectionForm = {
    nickname: '',
    type: DBProvider.PostgreSQL,
    remember: false,
  };

  const [form, setForm] = useState<INewConnectionForm>(defaultForm);
  const [errors, setErrors] = useState<INewConnectionErrors>({});
  const [alert, setAlert] = useState<boolean>(false);
  const [connectionStringActive, setConnectionStringActive] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const setField = (field: string, value: string | DBProvider | boolean) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (errors[field as keyof INewConnectionErrors])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const clearForm = () => {
    setForm(defaultForm);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const enumVal = event.target.value as DBProvider;
    setField('type', enumVal);
  };

  const validateForm = () => {
    const newErrors: INewConnectionErrors = {};
    const {
      nickname,
      type,
      database,
      address,
      port,
      username,
      password,
      connectionString,
    } = form;
    if (!nickname) {
      newErrors.nickname = 'Please type a nickname.';
    }
    if (connectionStringActive) {
      if (!connectionString) {
        newErrors.connectionString = 'Please type a connection string.';
      }
    } else {
      if (!type) {
        newErrors.type = 'Please select a database type.';
      }
      if (!database) {
        newErrors.type = 'Please type a database';
      }
      if (!address) {
        newErrors.address = 'Please type an address.';
      }
      if (!port) {
        newErrors.port = 'Please type a port.';
      }
      if (!username) {
        newErrors.username = 'Please type a database user.';
      }
      if (!password) {
        newErrors.password = 'Please type a password.';
      }
    }

    return newErrors;
  };
  const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let connectionConfig: ManualConnectionConfig | ConnectionString;
    if (connectionStringActive) {
      connectionConfig = {
        config: 'string',
        connectionString: form.connectionString!,
      };
    } else {
      connectionConfig = {
        config: 'manual',
        defaultDatabase: form.database!,
        address: form.address!,
        port: form.port!,
        username: form.username!,
        password: form.password!,
      };
    }

    const connection: ConnectionInputType = {
      nickname: form.nickname,
      type: form.type,
      connectionConfig,
    };

    try {
      // creates the server connection in sqlite and connects to it
      await window.connections.ipcRenderer.create(connection);

      // verify if server connection was established
      const verified = await window.connections.ipcRenderer.verify();
      if (!verified) {
        setAlert(true);
        return;
      }
      // show alert modal if unexpected error
    } catch (e) {
      setAlert(true);
      return;
    }

    clearForm();
    navigate('/execute');
  };
  return (
    <div>
      <div className="d-flex justify-content-center">
        <Form className="new-conn-form" onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-2" controlId="connectionNickname">
            <Form.Label className="form-label-sm">Nickname</Form.Label>
            <Form.Control
              className="form-control-sm"
              value={form.nickname}
              onChange={(e) => {
                setField('nickname', e.target.value);
              }}
              type="text"
              placeholder="Database Nickname"
              isInvalid={!!errors.nickname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nickname}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" controlId="connectionType">
            <Form.Label>Type</Form.Label>
            <Form.Select
              className="form-select-sm"
              aria-label="Default select example"
              onChange={handleSelectChange}
            >
              {Object.keys(DBProvider).map((key) => (
                <option>{key}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {!connectionStringActive && (
            <>
              <Form.Group className="mb-2" controlId="connectionAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  className="form-control-sm"
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  type="text"
                  placeholder="Ex: localhost"
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="connectionPort">
                <Form.Label>Port</Form.Label>
                <Form.Control
                  className="form-control-sm"
                  value={form.port}
                  onChange={(e) => setField('port', e.target.value)}
                  type="number"
                  placeholder="Ex: 3000"
                  isInvalid={!!errors.port}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.port}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="connectionDatabase">
                <Form.Label>Database</Form.Label>
                <Form.Control
                  className="form-control-sm"
                  value={form.database}
                  onChange={(e) => setField('database', e.target.value)}
                  type="text"
                  placeholder="Ex: React"
                  isInvalid={!!errors.database}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.database}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="connectionUser">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  className="form-control-sm"
                  value={form.username}
                  onChange={(e) => setField('username', e.target.value)}
                  type="text"
                  placeholder="Username"
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="connectionPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  className="form-control-sm"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  type="password"
                  placeholder="Password"
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}
          {connectionStringActive && (
            <Form.Group className="mb-2" controlId="connectionString">
              <Form.Label>Connection String</Form.Label>
              <Form.Control
                className="form-control-sm"
                value={form.connectionString}
                onChange={(e) => setField('connectionString', e.target.value)}
                type="text"
                placeholder="Ex: postgresql://username:password@address:port/db"
                isInvalid={!!errors.connectionString}
                as="textarea"
                rows={3}
              />
              <Form.Control.Feedback type="invalid">
                {errors.connectionString}
              </Form.Control.Feedback>
            </Form.Group>
          )}
          <Form.Group className="mb-2" controlId="formBasicCheckbox">
            <Form.Check
              checked={form.remember}
              onChange={(e) => setField('remember', e.target.value)}
              type="checkbox"
              label="Remember this connection"
            />
          </Form.Group>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Connect
              </Button>
            </Col>
            <Col>
              <Form.Switch
                label="Use connection string"
                onChange={() => {
                  setConnectionStringActive(!connectionStringActive);
                  clearErrors();
                }}
              />
            </Col>
          </Row>
        </Form>
      </div>
      <Modal show={alert} onHide={() => setAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Could not connect to the server. Please check your configuration
          details.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAlert(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewConnectionForm;
