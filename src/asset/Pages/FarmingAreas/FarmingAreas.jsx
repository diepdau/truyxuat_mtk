import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import "../Home/HerdsList.css";
import FarmingAreas_Create from "./FarmingAreas_Create.jsx";
import ImageUploader from "../../../components/Images/Image.jsx";
import { TabPanel, TabView } from "primereact/tabview";
import { Paginator } from "primereact/paginator";
import { handleDelete, urlGet } from "../../service/farm_data.js";
import { AuthContext } from "../../service/user_service.js";
import {
  CustomDialog,
  SearchBar,
  CustomPaginator,
} from "../../../components/Total_Interface/index.jsx";
import withLoader from "../../Design/HOC/withLoader.js";

const emptyProduct = {
  _id: null,
  name: "",
  description: "",
  area: "",
  address: "",
  coordinates: [0, 0],
};
const FarmmingAreas = (props) => {
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
    setProducts(props.data.farms);
    setTotalPages(props.data.totalPages);
  }, []);

  const onPageChange = (event) => {
    setCurrentPage(+event.page + 1);
    setCurrentLimit(event.rows);
  };
  const openNew = () => {
    setProductDialog(true);
  };
  const reloadData = () => {
    setProducts(props.data.farms);
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
      try {
        reloadData();
      } catch {}
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
    try {
      reloadData();
    } catch {}
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
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [expandedRows, setExpandedRows] = useState(null);
  const rowExpansionTemplate = (data) => {
    product._id = data._id;
    var url = `https://agriculture-traceability.vercel.app/api/v1/farms/upload/${product._id}`;
    return (
      <>
        <TabView>
          <TabPanel header="Thông tin">
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <FarmingAreas_Create
              data={data}
              isUpdate={true}
              reloadData={reloadData}
            />
          </TabPanel>
          <TabPanel header="Hình ảnh">
            <ImageUploader
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
  const [input, setInput] = useState("");
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Quản lý trang trại</h4>
      <SearchBar value={input} onChange={setInput} />
    </div>
  );
  return (
    <div className="div_main">
      <Toast className="toast" ref={toast} />
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
          header={header}
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column selectionMode="multiple" exportable={true}></Column>
          <Column
            sortable
            field="name"
            header="Tên cơ sở"
            value={product.name}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="area"
            header="Diện tích"
            value={product.area}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="address"
            header="Địa chỉ"
            value={product.address}
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
          productNameMany={"vùng"}
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
          <FarmingAreas_Create reloadData={reloadData} />
        </Dialog>
      </div>
    </div>
  );
};
export default withLoader(FarmmingAreas, urlGet);
