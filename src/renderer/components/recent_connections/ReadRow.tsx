import { Link } from 'react-router-dom';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import { MouseEvent } from 'react';
import { ConnectionModelType } from '../../../db/models/ConnectionModels';

interface IReadProps {
  value: ConnectionModelType;
  handleDelete: (number: number) => Promise<void>;
  handleSelect: (number: number) => Promise<void>;
  handleEdit: (event: MouseEvent, connection: ConnectionModelType) => void;
}
const ReadRow = ({
  value,
  handleDelete,
  handleSelect,
  handleEdit,
}: IReadProps) => {
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
      <td>{value.address}</td>
      <td>{value.port}</td>
      <td>{value.username}</td>
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
};
export default ReadRow;
