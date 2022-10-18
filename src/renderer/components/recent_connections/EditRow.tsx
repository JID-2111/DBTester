import '../../scss/RecentConnections.scss';
import { Check, X } from 'react-bootstrap-icons';
import { useState } from 'react';
import { ConnectionModelType } from '../../../db/models/ConnectionModels';

interface IProps {
  value: ConnectionModelType;
  toggleReadOnly: () => void;
  handleSubmit: (name: string) => void;
}

const EditRow = ({ value, toggleReadOnly, handleSubmit }: IProps) => {
  const [name, setName] = useState<string>('');
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
      <td>{value.address}</td>
      <td>{value.port}</td>
      <td>{value.username}</td>
      <td>
        <button type="button" className="buttonSelect">
          <Check onClick={() => handleSubmit(name)} />
        </button>
        <button
          type="button"
          className="deleteButton"
          onClick={() => toggleReadOnly()}
        >
          <X />
        </button>
      </td>
    </tr>
  );
};

export default EditRow;
