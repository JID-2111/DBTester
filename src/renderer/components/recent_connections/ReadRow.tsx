import { Link } from 'react-router-dom';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import { MouseEvent } from 'react';
import { ConnectionModel } from '../../../db/models/ConnectionModels';

interface IReadProps {
  value: ConnectionModel;
  handleDelete: (number: number) => Promise<void>;
  handleSelect: (number: number) => Promise<void>;
  handleEdit: (event: MouseEvent, connection: ConnectionModel) => void;
}
const ReadRow = ({
  value,
  handleDelete,
  handleSelect,
  handleEdit,
}: IReadProps) => {
  if (value.connectionConfig.config === 'manual') {
    return (
      <tr key={value.id}>
        <td>
          <Link to="/Execute">
            <button
              className="buttonSelect"
              type="button"
              onClick={() => handleSelect(value.id)}
            >
              {value.nickname}
            </button>
          </Link>
        </td>
        <td>{value.type}</td>
        <td>{value.connectionConfig.address}</td>
        <td>{value.connectionConfig.port}</td>
        <td>{value.connectionConfig.username}</td>
        <td>
          <button
            type="button"
            className="deleteButton"
            onClick={() => handleDelete(value.id)}
          >
            <Trash />
          </button>
          <button
            className="edit-button"
            type="button"
            onClick={(event) => handleEdit(event, value)}
          >
            <PencilSquare />
          </button>
        </td>
      </tr>
    );
  }
  return null;
};
export default ReadRow;
