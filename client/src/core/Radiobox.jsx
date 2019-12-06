import React from "react";

const Radiobox = ({ prices, handleFilters }) => {
  const handleChange = event => {
    //value is an string, so we make it an array of strings
    let priceArray = event.target.value.split(",");

    //we make the string array into int array or set an empty array
    priceArray = priceArray.length === 1 ? ["Any"] : priceArray.map(price => parseInt(price));
    handleFilters(priceArray);
  };

  return prices.map((p, i) => {
    //making the label out of the value than comes as a array of pairs values or "Any" as follows:
    //  value: ["Any"]  or  value: [0, 19]
    let label = p.value.length === 1 ? `${p.value[0]}` : `$${p.value[0]} to $${p.value[1]}`;
    return (
      <li key={i} className="list-unstyled">
        <label className="form-check-label">
          <input
            value={p.value}
            onChange={handleChange}
            type="radio"
            className="form-radio-input ml-4 mr-3"
            name={p}
          />
          {label}
        </label>
      </li>
    );
  });
};

export default Radiobox;
