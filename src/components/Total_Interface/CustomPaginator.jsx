import React from 'react';
import { Paginator } from "primereact/paginator";

const CustomPaginator = ({ currentPage, totalRecords, rows, onPageChange }) => (
  <Paginator
    first={(currentPage - 1) * rows}
    totalRecords={totalRecords}
    rows={rows}
    rowsPerPageOptions={[5, 10, 20]}
    onPageChange={onPageChange}
  />
);

export default CustomPaginator;
