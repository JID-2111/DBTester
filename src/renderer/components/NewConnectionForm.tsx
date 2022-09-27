import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export interface ConnectionString {
  nickname: string;
  address: string;
  port: string;
  username: string;
  password: string;
  remember: boolean;
}

const NewConnectionForm = () => {
  const [nickname, setNickname] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [port, setPort] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);

  const clearState = () => {
    setNickname('');
    setAddress('');
    setPort('');
    setUsername('');
    setPassword('');
    setRemember(false);
  };
  const handleSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    const connection: ConnectionString = {
      nickname,
      address,
      port,
      username,
      password,
      remember,
    };
    console.log('submitted', connection);
    clearState();
  };
  return (
    <div>
      <div className="d-flex justify-content-center">
        <Form className="new-connection-form" onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="connectionNickname">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              type="address"
              placeholder="Database Nickname"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="connectionAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="address"
              placeholder="Ex: localhost"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="connectionPort">
            <Form.Label>Port</Form.Label>
            <Form.Control
              value={port}
              onChange={(e) => setPort(e.target.value)}
              type="port"
              placeholder="Ex: 3000"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="connectionUser">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="port"
              placeholder="Username"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="connectionPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="port"
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              checked={remember}
              onChange={() => setRemember(!remember)}
              type="checkbox"
              label="Remember this connection"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Connect
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default NewConnectionForm;
