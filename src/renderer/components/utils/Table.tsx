import { Table as BTable } from 'react-bootstrap';

import '../../scss/Table.scss';

interface ITableProps {
  headers: string[];
  rows: RowContent[];
}

type RowContent = {
  [key: string]: string | number | boolean | React.ReactElement;
  rightComponent: React.ReactElement;
};

const Table = ({ headers, rows }: ITableProps) => {
  return (
    <div className="table-wrapper">
      <BTable responsive>
        <thead>
          <tr>
            {headers.map((header) => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr>
              {headers.map((header) => {
                if (header !== 'rightComponent') {
                  return <td>{row[header]}</td>;
                }
                return null;
              })}
              {row.rightComponent}
            </tr>
          ))}
        </tbody>
      </BTable>
    </div>
  );
};

export default Table;
