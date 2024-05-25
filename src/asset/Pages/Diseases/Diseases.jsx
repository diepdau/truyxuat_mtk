import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import "../Home/HerdsList.css";
import { TabView, TabPanel } from "primereact/tabview";
import Diseases_Update from "./Diseases_Update.jsx";
import Diseases_Create from "./Diseases_Create.jsx";
import Image from "../../../components/Images/Image.jsx";
import "./Diseases.css";
import {urlGet, handleDelete } from "../../service/disease_data.js";
import { AuthContext } from "../../service/user_service.js";
import {
  CustomDialog,
  CustomPaginator,
} from "../../../components/Total_Interface/index.jsx";
import withLoader from "../../Design/HOC/withLoader.js";
const emptyProduct = {
  _id: null,
  name: "",
  description: "",
  symptoms: "",
  preventive_measures: "",
};
 const Disease=(props) =>{
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const toast = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    setProducts(props.data.diseases);
    setTotalPages(props.data.totalPages);
  }, [currentPage, currentLimit]);

  const onPageChange = (event) => {
    setCurrentPage(+event.page + 1);
    setCurrentLimit(event.rows);
  };
  const openNew = () => {
    setProductDialog(true);
  };

  const reloadData = () => {
    setProducts(props.data.diseases);
    setTotalPages(props.data.totalPages);
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
      toast.current.show({
        severity: "success",
        summary: "Đã xóa",
        life: 3000,
      });
    }
  };
  const deleteProduct = () => {
    let _products = products.filter((val) => val._id === product._id);
    const firstObject = _products[0];
    handleDeleteUser(firstObject);
    setDeleteProductDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Đã xóa",
      life: 3000,
    });
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div className="iconpage">
          <i
            className="pi pi-trash"
            onClick={() => confirmDeleteProduct(rowData)}
          ></i>
        </div>
      </React.Fragment>
    );
  };

  const handleDeleteUser = async (product) => {
    try {
      handleDelete(product._id, token);
      reloadData();
      reloadData();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [expandedRows, setExpandedRows] = useState(null);
  const rowExpansionTemplate = (data) => {
    product._id = data._id;
    var url = `https://agriculture-traceability.vercel.app/api/v1/diseases/upload/${product._id}`;
    return (
      <>
        <TabView>
          <TabPanel header="Thông tin">
            <Diseases_Update data={data} reloadData={reloadData} />
          </TabPanel>
          <TabPanel header="Hình ảnh">
            <Image
              uploadUrl={url}
              images={data.images}
              reloadData={reloadData}
            />
          </TabPanel>
        </TabView>
      </>
    );
  };
  const allowExpansion = (rowData) => {
    return rowData;
  };
 
  return (
    <div className="div_main">
      <Toast className="toast" ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
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
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column selectionMode="multiple" exportable={true}></Column>
          <Column
            sortable
            field="name"
            header="Bệnh"
            value={product.name}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ left: "0" }}
          ></Column>
        </DataTable>
        <CustomPaginator
          currentPage={currentPage}
          totalRecords={totalPages * currentLimit}
          rows={currentLimit}
          onPageChange={onPageChange}
        />

<CustomDialog
          visible={deleteProductsDialog}
          header="Thông báo"
          type="deleteMany"
          onHide={hideDeleteProductsDialog}
          deleteSelectedProducts={deleteSelectedProducts}
          productNameMany={"bệnh"}
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
          <Diseases_Create reloadData={reloadData} />
        </Dialog>
      </div>
    </div>
  );
}
export default (withLoader(Disease, urlGet));