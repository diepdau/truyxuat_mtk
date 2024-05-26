import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import "../Home/HerdsList.css";
import { TabView, TabPanel } from "primereact/tabview";
import ProductPatchs_Update from "./ProductPatchs_Update.jsx";
import ImageComponent from "../../../components/Images/Image.jsx";
import "./ProductPatchs.css";
import Harvest_Update from "../Harvest/Harvest_Update.jsx";
import ProductPatchs_Create from "./ProductPatchs_Create.jsx";
import { Image } from "primereact/image";
import { handleDelete,handleGet } from "../../service/productPatchs_data.js";
import { AuthContext } from "../../service/user_service.js";
import {
  CustomDialog,
  SearchBar,
  CustomPaginator,
} from "../../../components/Total_Interface/index.jsx";
import {NotifiDelete} from "../../Design/Observable/index.js";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    handleGet(token, currentLimit, currentPage, input)
      .then((data) => {
        setProducts(data.processors);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.log("Error fetching data:", error));
  }, []);
  
  

  const onPageChange = (event) => {
    setCurrentPage(+event.page + 1);
    setCurrentLimit(event.rows);
  };

  const openNew = () => {
    setProductDialog(true);
  };
  const reloadData = () => {
    handleGet(token, currentLimit, currentPage, input).then((data) => {
      setProducts(data.processors);
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
          label="Thông tin loại"
          severity="success"
          onClick={onClickInforProduct}
        />
        <Button
          label="Danh sách sản phẩm"
          severity="success"
          onClick={onClickProcessorProduct}
        />
      </div>
    );
  };
  const onClickInforProduct = () => {
    navigate(`/thong-tin`);
  };
  const onClickProcessorProduct = () => {
    navigate(`/processors/products`);
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
    var url = `https://agriculture-traceability.vercel.app/api/v1/processors/upload/${product._id}`;
    return (
      <>
        <TabView>
          <TabPanel header="Thông tin đóng gói">
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <ProductPatchs_Update
              data={data}
              reloadData={reloadData}
              isUpdate={true}
            />
          </TabPanel>
          <TabPanel header="Chi tiết tổng sản phẩm">
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <Harvest_Update
              data={data.harvest}
              reloadData={reloadData}
              isProcessors={true}
            />
          </TabPanel>

          <TabPanel header="Hình ảnh">
            <ImageComponent
              uploadUrl={url}
              images={data.images}
              reloadData={reloadData}
            />
          </TabPanel>
        </TabView>
      </>
    );
  };
  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <Image
          src={rowData.qr_code}
          className="shadow-2 border-round"
          height="80"
          preview
        />
      </>
    );
  };
  const allowExpansion = (rowData) => {
    return rowData;
  };
  const [input, setInput] = useState("");
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Quản lý đóng gói</h4>
      <SearchBar value={input} onChange={setInput} />

    </div>
  );
  return (
    <div className="div_main">     
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
            field="product.qrcode"
            header="Qrcode"
            body={imageBodyTemplate}
          ></Column>
          <Column
            sortable
            field="harvest.name"
            header="Sản phẩm"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="quantity"
            header="Số lượng"
            style={{ minWidth: "10rem" }}
          ></Column>

          <Column
            field="production_date"
            header="Ngày sản xuất"
            style={{ minWidth: "14rem" }}
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
          productNameMany={"thu hoạch"}
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
          <ProductPatchs_Create reloadData={reloadData} isUpdate={false} />
        </Dialog>
      </div>
    </div>
  );
}
