import React, { useState, useEffect, useRef,useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { NotifiDelete } from "../../Design/Observable/index.js";
import "../Home/HerdsList.css";
import { classNames } from "primereact/utils";
import { TabView, TabPanel } from "primereact/tabview";
import Harvest_Update from "./Harvest_Update.jsx";
import Harvest_Create from "./Harvest_Create.jsx";
import Image from "../../../components/Images/Image.jsx";
import Chart_Herds from "./Chart_Herds.jsx";
import Chart_Products from "./Chart_Products.jsx";
import "./Harvest.css";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Paginator } from "primereact/paginator";
import {DateConverter} from "../../../components/Date/Date.jsx";
import { handleDelete,handleGetHerdHarvest} from "../../service/harvest_data.js";
import { AuthContext } from "../../service/user_service.js";
const emptyProduct = {
  _id: null,
  name: "",
  herd: "",
  quantity: "",
  unit: "",
  date: "",
};
function Harvest({ isherdharvest }) {
  const { token } = useContext(AuthContext);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [harvests, setHarvests] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const toast = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchData();
  }, [currentPage, currentLimit]);

  const fetchData = async (value = "") => {
    if (isherdharvest) {
      try {
        // const response = await fetch(
        //   `/harvests/herd/${isherdharvest}&limit=${currentLimit}&page=${currentPage}&searchQuery=${encodeURIComponent(
        //     value
        //   )}`
        // );
        const response = await handleGetHerdHarvest(isherdharvest,token);
        response.data.harvests.forEach((element) => {
          element.date = DateConverter(element.date); 
        });
        
        setHarvests(response.data.harvests);

        // setTotalPages(data.totalPages);
      } catch (error) {
        console.log("There was a problem with the fetch operation:", error);
      }
    } else {
      try {
        const response = await fetch(
          `https://agriculture-traceability.vercel.app/api/v1/harvests?limit=${currentLimit}&page=${currentPage}&searchQuery=${encodeURIComponent(
            value
          )}`
        );
        const data = await response.json();
        data.harvests.forEach((element) => {
        element.date = DateConverter(element.date); 

        });
        setHarvests(data.harvests);
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
    let _products = harvests.filter((val) => val._id === product._id);
    const firstObject = _products[0];
    handleDeleteUser(firstObject);
    setDeleteProductDialog(false);
    NotifiDelete();
    reloadData();
  };

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="Thoát"
        severity="secondary"
        outlined
        onClick={hideDeleteProductsDialog}
        className="button_Dia"
      />
      <Button
        label="Đồng ý"
        onClick={deleteSelectedProducts}
        severity="danger"
        className="button_Dia"
      />
    </React.Fragment>
  );
  const deleteoneProductDialogFooter = (
    <React.Fragment>
      <Button
        className="button_Dia"
        label="Thoát"
        severity="secondary"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        className="button_Dia"
        label="Đồng ý"
        severity="danger"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
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
      handleDelete(product._id,token);
      reloadData();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const [expandedRows, setExpandedRows] = useState(null);
  const rowExpansionTemplate = (data) => {
    product._id = data._id;
    var url = `https://agriculture-traceability.vercel.app/api/v1/harvests/upload/${product._id}`;
    return (
      <>
        <TabView>
          <TabPanel header="Thông tin">
          {/* eslint-disable-next-line react/jsx-pascal-case */}
            <Harvest_Update
              data={data}
              reloadData={reloadData}
              isProcessors={false}
            />
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
  const [input, setInput] = useState("");
  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
  const isProcessedBodyTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": rowData.isProcessed,
          "text-red-500 pi-times-circle": !rowData.isProcessed,
        })}
      ></i>
    );
  };
  const isProcessedFilterTemplate = (isProcessed) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Verified
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={isProcessed.value}
          onChange={(e) => isProcessed.filterCallback(e.value)}
        />
      </div>
    );
  };
  const stockBodyTemplate = (rowData) => {
    const stockClassName = classNames(
      "border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm",
      {
        "bg-red-100 text-red-900": rowData.quantity === 0,
        "bg-blue-100 text-blue-900":
          rowData.quantity > 0 && rowData.quantity < 10,
        "bg-teal-100 text-teal-900": rowData.quantity > 10,
      }
    );

    return <div className={stockClassName}>{rowData.quantity}</div>;
  };
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Quản lý thu hoạch</h4>
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
    <div className={isherdharvest? "": "div_main"} >
      {!isherdharvest && (
        <>
          {/* <Chart_Herds /> */}
          <Chart_Products reloadData={reloadData} />
        </>
      )}

      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          // right={rightToolbarTemplate}
        ></Toolbar>
        <DataTable
          header={header}
          value={harvests}
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
            header="Tên sản phẩm"
            value={product.name}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="quantity"
            header="Số lượng"
            // body={stockBodyTemplate}
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            field="unit"
            header="ĐVT"
            value={product.unit}
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            field="herd.name"
            header="Tên đàn"
            value={product.herd.name}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="date"
            header="Ngày"
            value={product.date}
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="isProcessed"
            header="Trạng thái đóng gói"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "5rem" }}
            body={isProcessedBodyTemplate}
            // filter
            // filterElement={isProcessedFilterTemplate}
          />
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
        />
        <Dialog
          visible={deleteProductsDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thông báo"
          modal
          footer={deleteProductDialogFooter}
          onHide={hideDeleteProductsDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && <span>Bạn có chắc chắn xóa những thu hoạch này?</span>}
          </div>
        </Dialog>
        <Dialog
          visible={deleteProductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thông báo"
          modal
          footer={deleteoneProductDialogFooter}
          onHide={hideDeleteProductDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Bạn có chắc chắn muốn xóa <b>{product.name}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          header="Thêm mới"
          style={{ width: "50%" }}
          visible={productDialog}
          onHide={() => setProductDialog(false)}
        >
          <Harvest_Create reloadData={reloadData} idherd={isherdharvest} />
        </Dialog>
      </div>
    </div>
  );
}
export default Harvest;
