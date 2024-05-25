import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import {
  handleGetRecords,
  handleUpdateAnimal,
  createNewAutoHerd,
  handleDeleteAnimal,
} from "../../service/Herd_data.js";
import "./HerdsList.css";
import Record_Create from "./Record_Create.jsx";
import { Calendar } from "primereact/calendar";
import ImageUploader from "../../../components/Images/Image";
import { AuthContext } from "../../service/user_service.js";
import { CustomDialog } from "../../../components/Total_Interface/index.jsx";
import { ToastContainer } from "react-toastify";
import { NotifiUpdate,NotifiDelete,NotifiCreateRecord } from "../../Design/Observable/index.js";
const emptyProduct = {
  _id: null,
  name: "",
  birth_weight: "",
  birth_date: new Date(),
  is_harvested: "",
  quantity: 0,
  herd: "",
};
export default function SizeDemo({ herdId }) {
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [productDialogNewAuto, setProductDialogNewAuto] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    handleGetRecords(herdId, token).then((data) => {
      setProducts(data.herd.records);
    });
  }, [herdId, token]);

  const reloadData = () => {
    handleGetRecords(herdId, token).then((data) => {
      setProducts(data.herd.records);
    });
  };
  const openNew = () => {
    setProductDialog(true);
  };
  const openNewAuto = () => {
    setProductDialogNewAuto(true);
  };
  const handleChange = (event) => {
    const { value, name } = event.target;
    if (name === "birth_weight" && parseFloat(value) < 0) {
      return;
    }
    setProduct({
      ...product,
      [name]: value,
    });
  };

  //Hàm tạo con trong đàn tự động
  const handleCreateNewAuto = async () => {
    try {
      await createNewAutoHerd(herdId, product.quantity, token);
      setProductDialogNewAuto(false);
      reloadData();
      NotifiCreateRecord();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  //Button xóa, thêm tự động
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Tạo" severity="success" onClick={openNew} />
        <Button label="Tạo tự động" severity="success" onClick={openNewAuto} />
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
  // Xử lý và thông báo xóa
  const deleteSelectedProducts = () => {
    for (const selectedProduct of selectedProducts) {
      handleDeleteUser(selectedProduct);
    }
    NotifiDelete()
    setDeleteProductsDialog(false);
  };
  const deleteProduct = () => {
    let _products = products.filter((val) => val._id === product._id);
    const firstObject = _products[0];
    handleDeleteUser(firstObject);
    setDeleteProductDialog(false);
    NotifiDelete()
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };
  //Xử lý xóa hàng trong bảng
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
      await handleDeleteAnimal(product._id, token);
      reloadData();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  //Xử lý thu hoạch chưa
  const Birth_weight = (options) => {
    return (
      <InputText
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        style={{ minWidth: "100%" }}
      />
    );
  };
  const Name = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const Birth_date = (options) => {
    return (
      <Calendar
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const onRowEditComplete = async (e) => {
    let _products = [...products];
    let { newData, index } = e;
    _products[index] = newData;
    if (selectedProducts.length === 0) {
      console.log("Vui lòng chọn ít nhất một sản phẩm trước khi tiếp tục.");
    } else {
      var hasSelectedProduct = false;
      for (const selectedProduct of selectedProducts) {
        var Id = selectedProduct._id;
        hasSelectedProduct = true;
        break;
      }
    }

    if (!hasSelectedProduct) {
      alert("Bạn phải chọn 1 con trong đàn.");
    }
    let formattedDate = "";
    if (newData.birth_date.props) {
      formattedDate = newData.birth_date.props.originalDate;
    } else {
      formattedDate = newData.birth_date;
    }
    console.log("birth_day", formattedDate);
    try {
      await handleUpdateAnimal(
        Id,
        {
          name: newData.name,
          birth_date: formattedDate,
          birth_weight: newData.birth_weight,
          herd: herdId,
        },
        token
      );
      reloadData();
      NotifiUpdate();
    } catch (error) {
      console.log("Error update:", error);
    }
  };
  const [expandedRows, setExpandedRows] = useState(null);
  const rowExpansionTemplate = (data) => {
    product._id = data._id;
    var url = `https://agriculture-traceability.vercel.app/api/v1/animals/upload/${product._id}`;
    return (
      <>
        <h3 style={{ color: "black" }}>Hình</h3>
        <ImageUploader
          uploadUrl={url}
          images={data.images}
          reloadData={reloadData}
        />
      </>
    );
  };
  const allowExpansion = (rowData) => {
    return rowData;
  };
  return (
    <div className={herdId ? "" : "div_main"}>
      <ToastContainer />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
        <DataTable
          value={products}
          editMode="row"
          selectionMode={"row"}
          onRowEditComplete={onRowEditComplete}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="_id"
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />

          <Column selectionMode="multiple" exportable={true}></Column>
          <Column
            sortable
            field="name"
            header="Tên"
            value={product.name}
            editor={(options) => Name(options)}
            style={{ minWidth: "10rem" }}
          ></Column>

          <Column
            sortable
            field="birth_date"
            header="Ngày sinh"
            value={product.birth_date}
            editor={(options) => Birth_date(options)}
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            sortable
            field="birth_weight"
            header="Cân nặng"
            value={product.birth_weight}
            editor={(options) => Birth_weight(options)}
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            rowEditor
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ textAlign: "center" }}
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
          productNameMany={"con"}
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
          modal
        >
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <Record_Create
            herdId={herdId}
            reloadData={reloadData}
            isUpdate={false}
          />
        </Dialog>

        <Dialog
          header="Thêm mới tự động"
          style={{ width: "20%" }}
          visible={productDialogNewAuto}
          onHide={() => setProductDialogNewAuto(false)}
          modal
        >
          <div>
            <h4 className="quantity_auto">Số lượng</h4>
            <InputText
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "2vh" }}
            />
          </div>
          <Button
            className="button_Dia"
            label="Lưu"
            severity="success"
            onClick={handleCreateNewAuto}
          />
          <Button
            className="button_Dia"
            label="Hủy"
            severity="secondary"
            outlined
            onClick={() => setProductDialogNewAuto(false)}
          />
        </Dialog>
      </div>
    </div>
  );
}
