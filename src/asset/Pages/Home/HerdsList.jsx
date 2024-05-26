import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import Infor_Create from "./Infor_Create.jsx";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./HerdsList.css";
import { AuthContext } from "../../service/user_service.js";
import { handleDelete, handleGet } from "../../service/Herd_data.js";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import {
  CustomDialog,
  SearchBar,
  CustomPaginator,
} from "../../../components/Total_Interface/index.jsx";
import Observer from "../../Design/Observable/Observer.jsx";
const emptyProduct = {
  _id: null,
};

export default function SizeDemo() {
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
  const [input, setInput] = useState("");

  useEffect(() => {
    handleGet(token, currentLimit, currentPage, input)
      .then((data) => {
        setProducts(data.herds);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.log("Error fetching data:", error));
  }, [token, currentLimit, currentPage, input]);

  const onPageChange = (event) => {
    setCurrentPage(+event.page + 1);
    setCurrentLimit(event.rows);
  };

  const openNew = () => {
    setProductDialog(true);
  };
  const reloadData = () => {
    handleGet(token, currentLimit, currentPage, input).then((data) => {
      setProducts(data.herds);
      setTotalPages(data.totalPages);
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
        <Button
          label="Xem chi tiết"
          severity="success"
          onClick={onRowDoubleClick}
        />
        <Button label="Nhóm" severity="success" onClick={onClickCategories} />
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
      reloadData();
      setDeleteProductsDialog(false);
     Observer.notify(`Đàn mã ${selectedProduct.name} đã xóa`)
    }
  };
  const deleteProduct = () => {
    let _products = products.filter((val) => val._id === product._id);
    const firstObject = _products[0];
    handleDeleteUser(firstObject);
    reloadData();
    setDeleteProductDialog(false);
    Observer.notify(`Đàn mã ${firstObject.name} đã xóa`)

  };
  const navigate = useNavigate();
  const onRowDoubleClick = () => {
    if (!selectedProducts) {
      toast.current.show({
        severity: "warn",
        detail: "Bạn phải chọn 1 đàn",
        life: 3000,
      });
    } else {
      for (const selectedProduct of selectedProducts) {
        navigate(`/herds/${selectedProduct._id}`);
      }
    }
  };
  const onClickCategories = () => {
    navigate(`/categories`);
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
      await handleDelete(product, token);
      reloadData();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const representativeBodyTemplate = (rowData) => {
    const representative = rowData.category;

    return (
      <div className="flex align-items-center gap-2">
        <span>{representative.name}</span>
      </div>
    );
  };
  const isProcessedBodyTemplate = (rowData) => {
    let iconClass = "pi";
    if (rowData.status === "Chưa thu hoạch") {
      iconClass += " text-red-500 pi-times-circle";
    } else if (rowData.status === "Đang thu hoạch") {
      iconClass += " text-yellow-500 pi-circle";
    } else if (rowData.status === "Thu hoạch xong") {
      iconClass += " text-green-500 pi-check-circle";
    }

    return <i className={iconClass}></i>;
  };

  const stockBodyTemplate = (rowData) => {
    const stockClassName = classNames(
      "border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm",
      {
        "bg-teal-100 text-teal-900": rowData.farm.name > 6,
      }
    );

    return <div className={stockClassName}>{rowData.farm.name}</div>;
  };
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Quản lý nhóm</h4>
      <SearchBar value={input} onChange={setInput} />
    </div>
  );
  return (
    <div>
      <Toast className="toast" ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
        <DataTable
          value={products}
          selectionMode={"row"}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          editMode="row"
          dataKey="_id"
          header={header}
        >
          <Column selectionMode="multiple" exportable={true}></Column>
          <Column
            field="name"
            header="Tên đàn"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="member_count"
            header="Số lượng"
            sortable
            style={{ minWidth: "6rem" }}
          ></Column>
          <Column
            field="status"
            header="Trạng thái"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "5rem" }}
            body={isProcessedBodyTemplate}
          />
          <Column
            field="farm.name"
            sortable
            header="Tháng tuổi"
            style={{ minWidth: "6rem" }}
            body={stockBodyTemplate}
          ></Column>
          <Column
            header="Nhóm"
            sortable
            sortField="category.name"
            filterField="category"
            style={{ minWidth: "14rem" }}
            body={representativeBodyTemplate}
          />
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
          productNameMany={"đàn"}
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
          <Infor_Create isUpdate={false} reloadData={reloadData} />
        </Dialog>
      </div>
    </div>
  );
}
