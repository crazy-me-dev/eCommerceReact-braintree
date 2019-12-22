import React, { useState } from "react";
import { Radio, List } from "semantic-ui-react";

const Radiobox = ({ prices, handleFilters }) => {
  const [radioValue, setRadioValue] = useState(["Any"]);
  const handleChange = (event, { value, name }) => {
    //value is an string, so we make it an array of strings
    let priceArray = value.split(",");

    //we make the string array into int array or set an empty array
    priceArray = priceArray.length === 1 ? ["Any"] : priceArray.map(price => parseInt(price));
    handleFilters(priceArray);

    setRadioValue(value);
  };

  return prices.map((p, i) => {
    //making the label out of the value than comes as a array of pairs values or "Any" as follows:
    //  value: ["Any"]  or  value: [0, 19]
    let radioLabel = p.value.length === 1 ? `${p.value[0]}` : `$${p.value[0]} to $${p.value[1]}`;
    return (
      <List.Item key={i}>
        <Radio
          value={p.value.toString()}
          onChange={handleChange}
          name="radioGroup"
          label={radioLabel}
          checked={radioValue === p.value.toString()}
        />
      </List.Item>
    );
  });
};

export default Radiobox;
