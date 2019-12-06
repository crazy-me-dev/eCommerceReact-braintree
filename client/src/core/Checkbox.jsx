import React, { useState } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = categoryId => event => {
    //return the first index or -1
    const currentCategoryId = checked.indexOf(categoryId);
    const newCheckedCategory = [...checked];
    if (currentCategoryId === -1) {
      newCheckedCategory.push(categoryId);
    } else {
      newCheckedCategory.splice(currentCategoryId, 1);
    }
    setChecked(newCheckedCategory);
    handleFilters(newCheckedCategory);
  };

  return categories.map((c, i) => (
    <li key={i} className="list-unstyled">
      <input
        value={checked.indexOf(c._id) === -1}
        onChange={handleToggle(c._id)}
        type="checkbox"
        className="form-check-input"
      />
      <label className="form-check-label">{c.name}</label>
    </li>
  ));
};

export default Checkbox;
