import { ConnectionModelType } from 'db/Models';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import DBProvider from '../../db/entity/enum';

interface INewConnectionForm {
  nickname: string;
  type: DBProvider;
  address: string;
  port: string;
  username: string;
  password: string;
  remember: boolean;
}

interface INewConnectionErrors {
  nickname?: string;
  type?: string;
  address?: string;
  port?: string;
  username?: string;
  password?: string;
}

const NewConnectionForm = () => {
  const defaultForm: INewConnectionForm = {
    nickname: '',
    type: DBProvider.PostgreSQL,
    address: '',
    port: '',
    username: '',
    password: '',
    remember: false,
  };

  const [form, setForm] = useState<INewConnectionForm>(defaultForm);
  const [errors, setErrors] = useState<INewConnectionErrors>({});
  const [alert, setAlert] = useState<boolean>(false);

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const enumVal = event.target.value as DBProvider;
    setField('type', enumVal);
  };

  const validateForm = () => {
    const newErrors: INewConnectionErrors = {};
    const { nickname, type, address, port, username, password } = form;
    if (!nickname) {
      newErrors.nickname = 'Please type a nickname.';
    }
    if (!type) {
      newErrors.type = 'Please select a database type.';
    }
    if (!address) {
      newErrors.address = 'Please type an address.';
    }
    if (!port) {
      newErrors.port = 'Please type a port.';
    } else if (Number.isNaN(parseInt(port, 10))) {
      newErrors.port = 'Port must be a number.';
    }
    if (!username) {
      newErrors.username = 'Please type a database user.';
    }
    if (!password) {
      newErrors.password = 'Please type a password.';
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

    const connection: ConnectionModelType = {
      nickname: form.nickname,
      type: form.type,
      connectionConfig: {
        config: 'manual',
        address: form.address,
        port: parseInt(form.port, 10),
        username: form.username,
        password: form.password,
      },
    };

    try {
      // creates the server connection in sqlite and connects to it
      await window.connections.ipcRenderer.create(connection);

      // check if server exists by attempting to fetch procedures - might be a better way to do this
      await window.procedures.ipcRenderer.fetchProcedures();

      // show alert modal if error
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
        <Form className="new-connection-form" onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-2" controlId="connectionNickname">
            <Form.Label className="form-label-sm">Nickname</Form.Label>
            <Form.Control
              className="form-control-sm"
              value={form.nickname}
              onChange={(e) => {
                setField('nickname', e.target.value);
              }}
              type="address"
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
          <Form.Group className="mb-2" controlId="connectionAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              className="form-control-sm"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              type="address"
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
              type="port"
              placeholder="Ex: 3000"
              isInvalid={!!errors.port}
            />
            <Form.Control.Feedback type="invalid">
              {errors.port}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" controlId="connectionUser">
            <Form.Label>Username</Form.Label>
            <Form.Control
              className="form-control-sm"
              value={form.username}
              onChange={(e) => setField('username', e.target.value)}
              type="port"
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
              type="port"
              placeholder="Password"
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" controlId="formBasicCheckbox">
            <Form.Check
              checked={form.remember}
              onChange={(e) => setField('remember', e.target.value)}
              type="checkbox"
              label="Remember this connection"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Connect
          </Button>
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
