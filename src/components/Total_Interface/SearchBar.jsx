import React from 'react';
import { InputText } from "primereact/inputtext";

const SearchBar = ({ value, onChange }) => (
  <span className="p-input-icon-left">
    <i className="pi pi-search" />
    <InputText value={value} onChange={(e) => onChange(e.target.value)} placeholder="Tìm kiếm..." />
  </span>
);

export default SearchBar;
