import React, { useState } from "react";
import { Checkbox, List } from "semantic-ui-react";

const CheckboxList = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = categoryId => event => {
    //return the first index or -1
    const currentCategoryId = checked.indexOf(categoryId);
    const newCheckedCategory = [...checked];
    //if the categoryId is not in the array, we push it
    if (currentCategoryId === -1) {
      newCheckedCategory.push(categoryId);
    } else {
      //if the categoryId is in the array, we remove it
      newCheckedCategory.splice(currentCategoryId, 1);
    }
    setChecked(newCheckedCategory);
    handleFilters(newCheckedCategory);
  };

  return categories.map((c, i) => (
    <List.Item key={i}>
      <Checkbox onChange={handleToggle(c._id)} type="checkbox" label={c.name} />
    </List.Item>
  ));
};

export default CheckboxList;
