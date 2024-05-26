import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "../Home/HerdsList.css";
import { TabView, TabPanel } from "primereact/tabview";
import ProductPatchs_Update from "./ProductPatchs_Update.jsx";
import ImageComponent from "../../../components/Images/Image.jsx";
import "./ProductPatchs.css";
import { DateConverter } from "../../../components/Date/Date.jsx";
import { Image } from "primereact/image";
import { handleGetProcProduct } from "../../service/productPatchs_data.js";
import { AuthContext } from "../../service/user_service.js";
import { Toolbar } from "primereact/toolbar";

export default function SizeDemo() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const toast = useRef(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await handleGetProcProduct(token);
      response.data.products.forEach((element) => {
        element.production_date = DateConverter(element.production_date);
      });
      setProducts(response.data.products);
    } catch (error) {
      console.log("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]); // Chỉ gọi API khi token thay đổi

  const reloadData = () => {
    fetchData();
  };

  const [expandedRows, setExpandedRows] = useState(null);
  const rowExpansionTemplate = (data) => {
    return (
      <>
        <TabView>
          <TabPanel header="Thông tin chi tiết">
            <ProductPatchs_Update
              data={data}
              reloadData={reloadData}
              isUpdate={true}
              isProProduct={true}
            />
          </TabPanel>

          <TabPanel header="Hình ảnh">
            <ImageComponent images={data.images} />
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

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <span style={{ fontWeight: "bold", color: "green" }}>
          Danh sách sản phẩm
        </span>
      </div>
    );
  };

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
        >
          <Column expander={allowExpansion} style={{ width: "5rem" }} />
          <Column
            field="qrcode"
            header="Qrcode"
            body={imageBodyTemplate}
          ></Column>

          <Column
            sortable
            field="product_info.name"
            header="Sản phẩm"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="price"
            header="Giá"
            style={{ minWidth: "5rem" }}
          ></Column>

          <Column
            field="currency_unit"
            header="Tiền tệ"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="net_weight"
            header="Khối lượng tịnh"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="unit"
            header="ĐVT"
            style={{ minWidth: "5rem" }}
          ></Column>
          <Column
            field="production_date"
            header="Ngày sản xuất"
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
