import '../scss/RecentConnections.scss';
import { Check, X } from 'react-bootstrap-icons';
import { ConnectionModel } from 'db/Models';

interface IProps {
  value: ConnectionModel;
  handleCancel: () => void;
  handelChange: (event, value: ConnectionModel) => void;
}

const EditRow = ({ value, handleCancel, handelChange }: IProps) => {
  if (value.connectionConfig.config === 'manual') {
    return (
      <tr>
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
            <Check onClick={(event) => handelChange(event, value)} />
          </button>
          <button type="button" onClick={() => handleCancel()}>
            <X />
          </button>
        </td>
      </tr>
    );
  }
  return null;
};

export default EditRow;
