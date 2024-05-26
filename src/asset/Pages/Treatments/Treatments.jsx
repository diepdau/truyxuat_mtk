import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { NotifiDelete } from "../../Design/Observable/index.js";
import "../Home/HerdsList.css";
import { TabView, TabPanel } from "primereact/tabview";
import Treatments_Create from "./Treatments_Create.jsx";
import "./Treatments.css";
import { Paginator } from "primereact/paginator";
import { DateConverter } from "../../../components/Date/Date.jsx";
import { handleDelete } from "../../service/treatment_data.js";
import { AuthContext } from "../../service/user_service.js";
import { CustomDialog } from "../../../components/Total_Interface/index.jsx";

const emptyProduct = {
  _id: null,
  name: "",
  herd: "",
  quantity: "",
  unit: "",
  date: "",
};
export default function SizeDemo({ idherd, herdname }) {
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const toast = useRef(null);
  const { token } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    fetchData();
  }, [currentPage, currentLimit]);

  const fetchData = async (value = "") => {
    if (idherd) {
      try {
        const res = await fetch(
          `https://agriculture-traceability.vercel.app/api/v1/treatments/herd/${idherd}?limit=${currentLimit}&page=${currentPage}&searchQuery=${encodeURIComponent(
            value
          )}`
        );
        const data = await res.json();
        data.treatments.forEach((element) => {
          element.date = DateConverter(element.date);
          element.retreat_date = DateConverter(element.retreat_date);
        });
        setProducts(data.treatments);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log("There was a problem with the fetch operation:", error);
      }
    } else {
      try {
        const res = await fetch(
          `https://agriculture-traceability.vercel.app/api/v1/treatments?limit=${currentLimit}&page=${currentPage}&searchQuery=${encodeURIComponent(
            value
          )}`
        );
        const data = await res.json();
        data.treatments.forEach((element) => {
          element.date = DateConverter(element.date);
        });
        console.log(data.treatments);
        setProducts(data.treatments);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log("There was a problem with the fetch operation:", error);
      }
    }
  };
  const onPageChange = (event) => {
    setCurrentPage(+event.page + 1);
    setCurrentLimit(event.rows);
  };
  const openNew = () => {
    setProductDialog(true);
  };
  const reloadData = () => {
    fetchData();
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Tạo" severity="success" onClick={openNew} />
        <Button
          label="Xóa"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </div>
    );
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
    setDeleteProductsDialog(false);
  };
  const deleteSelectedProducts = () => {
    for (const selectedProduct of selectedProducts) {
      handleDeleteUser(selectedProduct);
      setDeleteProductsDialog(false);
      NotifiDelete();
    }
  };
  const deleteProduct = () => {
    let _products = products.filter((val) => val._id === product._id);
    const firstObject = _products[0];
    handleDeleteUser(firstObject);
    setDeleteProductDialog(false);
    NotifiDelete();
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <i
          className="pi pi-trash"
          onClick={() => confirmDeleteProduct(rowData)}
        ></i>
      </React.Fragment>
    );
  };

  const handleDeleteUser = async (product) => {
    try {
      await handleDelete(product._id, token);
      reloadData();
      reloadData();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const [expandedRows, setExpandedRows] = useState(null);
  const rowExpansionTemplate = (data) => {
    product._id = data._id;
    return (
      <>
        <TabView>
          <TabPanel header="Thông tin">
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <Treatments_Create
              data={data}
              reloadData={reloadData}
              isUpdate={true}
              nameherd={herdname}
            />
          </TabPanel>
        </TabView>
      </>
    );
  };
  const allowExpansion = (rowData) => {
    return rowData;
  };
  const [input, setInput] = useState("");
  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Quản lý điều trị</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </span>
    </div>
  );
  return (
    <div className={idherd ? "" : "div_main"}>
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          // right={rightToolbarTemplate}
        ></Toolbar>
        <DataTable
          value={products}
          selectionMode={"row"}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          editMode="row"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="_id"
          header={header}
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column selectionMode="multiple" exportable={true}></Column>

          <Column
            sortable
            field="herd.name"
            header="Đàn"
            style={{ minWidth: "10rem" }}
          ></Column>

          <Column
            sortable
            field="type"
            header="Loại"
            value={product.type}
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            sortable
            field="product"
            header="Thuốc sử dụng"
            value={product.product}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="amount"
            header="Liều lượng"
            value={product.amount}
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            sortable
            field="mode"
            header="Hình thức điều trị"
            value={product.mode}
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            field="date"
            header="Ngày"
            value={product.date}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ left: "0" }}
          ></Column>
        </DataTable>
        <Paginator
          first={(currentPage - 1) * currentLimit}
          totalRecords={totalPages * currentLimit} // Assuming you set the correct total number of records here
          rows={currentLimit}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={onPageChange}
        />{" "}
        <CustomDialog
          visible={deleteProductsDialog}
          header="Thông báo"
          type="deleteMany"
          onHide={hideDeleteProductsDialog}
          deleteSelectedProducts={deleteSelectedProducts}
          productNameMany={"điều trị"}
        />
        <CustomDialog
          visible={deleteProductDialog}
          header="Thông báo"
          type="deleteOne"
          onHide={hideDeleteProductDialog}
          deleteProduct={deleteProduct}
          productName={product.name}
        />
        <Dialog
          header="Thêm mới"
          style={{ width: "50%" }}
          visible={productDialog}
          onHide={() => setProductDialog(false)}
        >
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <Treatments_Create
            idherd={idherd}
            reloadData={reloadData}
            isUpdate={false}
          />
        </Dialog>
      </div>
    </div>
  );
}
