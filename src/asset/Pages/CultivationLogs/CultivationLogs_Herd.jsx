import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { ToastContainer } from "react-toastify";
import { NotifiDelete } from "../../Design/Observable/index.js";
import "../Home/HerdsList.css";
import { TabView, TabPanel } from "primereact/tabview";
import CultivationLogs_Update from "./CultivationLogs_Update.jsx";
import CultivationLogs_Create from "./CultivationLogs_Create.jsx";
import { handleDelete, handleGet } from "../../service/cultivationLog_data.js";
import { AuthContext } from "../../service/user_service.js";
import {CustomDialog} from "../../../components/Total_Interface/index.jsx";
const emptyProduct = {
  _id: null,
  herd: {
    _id: "",
    name: "",
  },
  name: "",
  description: "",
  date: "",
};
export default function CulivationLogs_Herd({ idherd }) {
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    handleGet(idherd,token)
      .then((data) => {
        console.log(data.data.cultivationLogs);
        setProducts(data.data.cultivationLogs);

      })
      .catch((error) => console.log("Error fetching data:", error));
  }, [token]);
  const openNew = () => {
    setProductDialog(true);
  };
  const reloadData = () => {
    handleGet(idherd,token).then((data) => {
      setProducts(data.data.cultivationLogs);
    });
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

  const confirmDeleteProduct = (rowData) => {
    setProduct(rowData);
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
      handleDelete(product._id, token);
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
            <CultivationLogs_Update reloadData={reloadData} data={data} />
          </TabPanel>
        </TabView>
      </>
    );
  };

  const allowExpansion = (rowData) => {
    return rowData;
  };

  return (
    <div className={idherd ? "" : "div_main"}>
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
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column selectionMode="multiple" exportable={true}></Column>
          <Column
            sortable
            field="name"
            header="Tên hoạt động"
            value={product.name}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="date"
            header="Ngày"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
        </DataTable>
        <CustomDialog
          visible={deleteProductsDialog}
          header="Thông báo"
          type="deleteMany"
          onHide={hideDeleteProductsDialog}
          deleteSelectedProducts={deleteSelectedProducts}
          productNameMany={"hoạt động này"}
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
          <CultivationLogs_Create reloadData={reloadData} herd_id={idherd} />
        </Dialog>
      </div>
    </div>
  );
}
