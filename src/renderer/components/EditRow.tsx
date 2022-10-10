import '../scss/RecentConnections.scss';
import { Check, X } from 'react-bootstrap-icons';
import { ConnectionModel } from 'db/Models';

interface IProps {
  value: ConnectionModel;
  toggleReadOnly: () => void;
  handleChange: (event) => void;
}

const EditRow = ({ value, toggleReadOnly, handleChange }: IProps) => {
  if (value.connectionConfig.config === 'manual') {
    return (
      <tr key={value.id}>
        <td>
          <input
            type="text"
            required
            defaultValue={value.nickname}
            name="Nickname"
          />
        </td>
        <td>{value.type}</td>
        <td>{value.connectionConfig.address}</td>
        <td>{value.connectionConfig.port}</td>
        <td>{value.connectionConfig.username}</td>
        <td>
          <button type="button">
            <Check onClick={(event) => handleChange(event)} />
          </button>
          <button type="button" onClick={() => toggleReadOnly()}>
            <X />
          </button>
        </td>
      </tr>
    );
  }
  return null;
};

export default EditRow;
