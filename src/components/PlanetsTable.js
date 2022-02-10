import React from 'react';
import PropTypes from 'prop-types';

function PlanetsTable({ dataTable }) {
  const columns = dataTable[0] && Object.keys(dataTable[0]);

  return (
    <table>
      <thead>
        <tr>
          {dataTable[0] && columns.map((head, index) => {
            if (head === 'residents') return null;
            return <th key={ index }>{head}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {dataTable.map((rows, index) => (
          <tr key={ index }>
            {
              columns.map((column) => {
                if (column === 'residents') return null;
                if (column === 'name') {
                  return (
                    <td data-testid="planet-name" key={ `${index} ${rows[column]}` }>
                      {rows[column]}
                    </td>
                  );
                }
                return (
                  <td
                    key={ `${index} ${rows[column]}` }
                  >
                    {rows[column]}
                  </td>);
              })
            }
          </tr>
        ))}
      </tbody>
    </table>
  );
}

PlanetsTable.propTypes = {
  dataTable: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PlanetsTable;
