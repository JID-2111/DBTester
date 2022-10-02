/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import { ConnectionModel } from '../../db/Models';
import DBProvider from '../../db/entity/enum';
import '../scss/RecentConnections.scss';

interface IEditProps {
  config: ConnectionModel;
  setConnect: () => void;
}

interface IEditFields {
  nickname: string;
}

const EditForm = ({ config, setConnect }: IEditProps) => {
  const [form, setForm] = useState<IEditFields>({
    nickname: config.nickname,
  });

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    setForm({
      ...form,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    config.nickname = form.nickname;
    await window.connections.ipcRenderer.update(config);
    setConnect();
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
        <PencilSquare />
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
