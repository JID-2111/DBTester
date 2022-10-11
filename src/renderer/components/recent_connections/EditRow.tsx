import '../../scss/RecentConnections.scss';
import { Check, X } from 'react-bootstrap-icons';
import { useState } from 'react';
import { ConnectionModel } from '../../../db/models/ConnectionModels';

interface IProps {
  value: ConnectionModel;
  toggleReadOnly: () => void;
  handleSubmit: (name: string) => void;
}

const EditRow = ({ value, toggleReadOnly, handleSubmit }: IProps) => {
  const [name, setName] = useState<string>('');
  if (value.connectionConfig.config === 'manual') {
    return (
      <tr key={value.id}>
        <td>
          <input
            type="text"
            required
            defaultValue={value.nickname}
            name="Nickname"
            onChange={(e) => {
              if (e.target.value === '' || undefined) {
                setName(value.nickname);
              } else {
                setName(e.target.value);
              }
            }}
          />
        </td>
        <td>{value.type}</td>
        <td>{value.connectionConfig.address}</td>
        <td>{value.connectionConfig.port}</td>
        <td>{value.connectionConfig.username}</td>
        <td>
          <button type="button">
            <Check onClick={() => handleSubmit(name)} />
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
