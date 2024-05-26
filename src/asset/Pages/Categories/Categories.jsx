import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from 'primereact/inputtext';
import "../Home/HerdsList.css";
import Categories_Create from "./Categories_Create.jsx";
import { TabPanel, TabView } from "primereact/tabview";
import {
  CustomDialog,
} from "../../../components/Total_Interface/index.jsx";
import { urlGet, handleDelete } from "../../service/categories_data.js";
import { AuthContext } from "../../service/user_service.js";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import withLoader from "../../Design/HOC/withLoader.js";
import ImageList from "../../Design/Compound_Category/ImageList.js";
import { ToastContainer } from "react-toastify";
import { NotifiDelete } from "../../Design/Observable/index.js";
const emptyProduct = {
  _id: null,
};

const Category = (props) => {
  const { token } = useContext(AuthContext);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  const [expandedRows, setExpandedRows] = useState(null);

  useEffect(() => {
    setProducts(props.data.categories);
  }, [props.data.categories]);

  const openNew = () => {
    setProductDialog(true);
  };

  const reloadData = () => {
    props.reloadData(); // Gọi hàm reloadData từ props để lấy lại dữ liệu
  };

  const leftToolbarTemplate = () => (
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

  const deleteSelectedProducts = async () => {
    for (const selectedProduct of selectedProducts) {
      await handleDelete(selectedProduct._id, token);
    }
    setDeleteProductsDialog(false);
    NotifiDelete();
    reloadData();
  };

  const deleteProduct = async () => {
    await handleDelete(product._id, token);
    setDeleteProductDialog(false);
    NotifiDelete();
    reloadData();
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const actionBodyTemplate = (rowData) => (
    <i
      className="pi pi-trash"
      onClick={() => confirmDeleteProduct(rowData)}
    ></i>
  );

  const rowExpansionTemplate = (data) => (
    <TabView>
      <TabPanel header="Thông tin">
        {/* eslint-disable-next-line react/jsx-pascal-case */}
        <Categories_Create
          data={data}
          isUpdate={true}
          reloadData={reloadData}
        />
      </TabPanel>
      <TabPanel className="on-small-screen" header="Hình ảnh">
        <ImageList />
      </TabPanel>
    </TabView>
  );

  const allowExpansion = (rowData) => rowData;

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Quản lý nhóm</h4>
      <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
    </div>
  );
  return (
    <div className="div_main">
      <ToastContainer />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
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
          header={header}  globalFilter={globalFilter}
          paginator rows={5} rowsPerPageOptions={[5, 10, 15]}
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column selectionMode="multiple" exportable={true}></Column>
          <Column
            sortable
            field="name"
            header="Tên nhóm"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ left: "0" }}
          ></Column>
        </DataTable>

        <CustomDialog
          visible={deleteProductsDialog}
          header="Thông báo"
          type="deleteMany"
          onHide={hideDeleteProductsDialog}
          deleteSelectedProducts={deleteSelectedProducts}
          productNameMany={"nhóm"}
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
          <Categories_Create reloadData={reloadData} isUpdate={false} />
        </Dialog>
      </div>
    </div>
  );
};

export default withLoader(Category, urlGet);


