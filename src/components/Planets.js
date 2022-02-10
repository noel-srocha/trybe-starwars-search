import React, { useEffect, useState } from 'react';
import PlanetsTable from './PlanetsTable';
import { useProvider } from '../context/PlanetProvider';
import FilterPlanetsByNumber from './FilterPlanetsByNumber';

function Planets() {
  const [data, setData] = useState([]);
  const { filters, setFilters } = useProvider();
  const { filterByNumericValues, order } = filters;
  const minusOne = -1;
  useEffect(() => {
    fetch('https://swapi-trybe.herokuapp.com/api/planets/')
      .then((response) => response.json())
      .then((json) => setData(json.results));
  }, []);

  function orderString(word) {
    if (order.sort === 'ASC') {
      return word.sort((a, b) => {
        if (a.name < b.name) {
          return minusOne;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    return word.sort((a, b) => {
      if (a.name < b.name) {
        return 1;
      }
      if (a.name > b.name) {
        return minusOne;
      }
      return 0;
    });
  }

  function orderNumber(number) {
    console.log(number);
    if (order.sort === 'ASC') {
      return number.sort((a, b) => (
        a.orbital_period.localeCompare(b.orbital_period, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      ));
    }
    return number.sort((a, b) => b.orbital_period - a.orbital_period);
  }

  function orderData(dataList) {
    if (order.column === 'Name') {
      const dataOrder = orderString(dataList);

      return dataOrder;
    }
    const dataOrder = orderNumber(dataList);

    return dataOrder;
  }

  const [localSort, setLocalSort] = useState({
    order: {
      column: 'Name',
      sort: 'ASC',
    },
  });

  function orderList() {
    console.log({
      ...filters,
      ...localSort,
    });
    setFilters({
      ...filters,
      ...localSort,
    });
  }

  function filterData(rows) {
    const { filterByName: { name } } = filters;
    const results = [];

    if (filterByNumericValues.length > 0) {
      filterByNumericValues.forEach((filter) => {
        const { column, comparison, value } = filter;
        switch (comparison) {
        case 'maior que':
          results.push(rows.filter((row) => (
            row.name.toLowerCase().indexOf(name.toLowerCase())
            > minusOne && parseInt(row[column], 0) > parseInt(value, 0))));
          break;
        case 'menor que':
          results.push(rows.filter((row) => (
            row.name.toLowerCase().indexOf(name.toLowerCase())
            > minusOne && parseInt(row[column], 0) < parseInt(value, 0))));
          break;
        case 'igual a':
          results.push(rows.filter((row) => (
            row.name.toLowerCase().indexOf(name.toLowerCase())
            > minusOne && parseInt(row[column], 0) === parseInt(value, 0))));
          break;
        default:
        }
      });
      if (results[0] && results[1]) {
        const finalFilter = results[0].filter((planet) => (
          results[1].includes(planet)
        ));
        return finalFilter;
      }
      return results[0];
    }
    return rows.filter((row) => (
      row.name.toLowerCase().indexOf(name.toLowerCase()) > minusOne
    ));
  }

  const deleteFilter = () => {
    const checkFilters = filterByNumericValues;
    checkFilters.shift();
    setFilters({
      ...filters,
      filterByNumericValues: checkFilters,
    });
  };

  return (
    <div>
      <label htmlFor="name-filter">
        Pesquisar Planeta:
        <input
          type="text"
          id="name-filter"
          data-testid="name-filter"
          onChange={ (e) => setFilters({
            ...filters,
            filterByName: {
              name: e.target.value,
            },
          }) }
        />
      </label>
      <FilterPlanetsByNumber />
      { filterByNumericValues.length > 0
      && (
        filterByNumericValues.map((value, index) => (
          <div data-testid="filter" key={ index }>
            <span>{ `${value.column} ` }</span>
            <span>{ `${value.comparison} ` }</span>
            <span>{ `${value.value} ` }</span>
            <button
              onClick={ deleteFilter }
              type="button"
            >
              X
            </button>
          </div>))
      )}
      <select
        data-testid="column-sort"
        onChange={ (e) => setLocalSort({
          order: {
            ...localSort.order,
            column: e.target.value,
          },
        }) }
      >
        <option value="Name">Name</option>
        <option value="orbital_period">Orbital Period</option>
      </select>

      <div
        onChange={ (e) => setLocalSort({
          order: {
            ...localSort.order,
            sort: e.target.id,
          },
        }) }
      >
        <label htmlFor="ASC">
          Crescente
          <input
            type="radio"
            name="sort"
            id="ASC"
            data-testid="column-sort-inpot-asc"
          />
        </label>
        <label htmlFor="DESC">
          Decrescente
          <input
            type="radio"
            name="sort"
            id="DESC"
            data-testid="column-sort-input-desc"
          />
        </label>
      </div>
      <button
        data-testid="column-sort-button"
        type="button"
        onClick={ orderList }
      >
        Ordenar
      </button>
      <PlanetsTable dataTable={ orderData(filterData(data)) } />
    </div>
  );
}

export default Planets;
