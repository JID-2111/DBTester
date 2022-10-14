/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import { DBProvider } from '../../../db/entity/enum';
import { ConnectionModelType } from '../../../db/models/ConnectionModels';
import '../../scss/RecentConnections.scss';

interface IEditProps {
  config: ConnectionModelType;
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
      <button className="edit-button" type="button" onClick={handleShow}>
        <PencilSquare />
      </button>

      <Modal
        show={show}
        handleClose={handleClose}
        title="Edit Connection"
        modalBody={
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
        }
        submit={handleSubmit}
      />
    </>
  );
};
export default EditForm;
