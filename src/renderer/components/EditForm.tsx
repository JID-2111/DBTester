/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useState } from 'react';
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

  const handleSubmit = async () => {
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
      <button type="button" className="edit-button">
        <PencilSquare onClick={handleShow} />
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Nickname"
                value={form.nickname}
                onChange={(e) => setField('nickname', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            className="edit-submit-btn"
          >
            Submit
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default EditForm;
