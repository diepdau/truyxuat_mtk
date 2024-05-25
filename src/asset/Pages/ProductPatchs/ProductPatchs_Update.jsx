import React, { useState, useRef, useEffect, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./ProductPatchs.css";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import Product_Infos_Actives from "../Product_Infos/Product_Infos_Active.jsx";
import { ToastContainer } from "react-toastify";
import { NotifiUpdate } from "../../Design/Observable/index.js";
import {
  handleUpdate,
  getProductInfos,
  getFarm,
} from "../../service/productPatchs_data.js";
import { AuthContext } from "../../service/user_service.js";
const emptyProduct = {
  name: "",
  price: "",
  net_weight: "",
  unit: "",
  dte: "",
  location: "",
  quantity: "",
  harvest: "",
  product_info: new Date(),
  currency_unit: "",
  // production_date: "",
};
const unitOptions = [
  { label: "Kg", value: "Kg" },
  { label: "Túi", value: "Túi" },
  { label: "Lít", value: "Lít" },
];
const currentunitOptions = [
  { label: "Đồng", value: "Đồng" },
  { label: "VND", value: "VND" },
];
function YourComponent({ data, reloadData, isUpdate, isProProduct }) {
  const [product, setProduct] = useState(data || emptyProduct);
  const [errors, setErrors] = useState({});
  const [ProductInfos, setProductInfos] = useState({});
  const [selectedProductInfos, setSelectedProductInfos] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const { token } = useContext(AuthContext);
  const [Farms, setFarms] = useState({});
  const [selectedFarm, setSelectedFarm] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    setProductInfos(await getProductInfos());
    setFarms(await getFarm());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const handleCurrencyUnitChange = (event) => {
    setProduct({
      ...product,
      currency_unit: event.value,
    });
  };
  const handleUnitChange = (event) => {
    setProduct({
      ...product,
      unit: event.value,
    });
  };
  const handleProductChange = (e) => {
    setSelectedProductInfos(e.value);
    product.product_info = e.value._id;
    setProductDescription(e.value.description); // Cập nhật mô tả khi chọn sản phẩm
  };
  const handle = async () => {
    if (!validate()) {
      return;
    }
    console.log(product.production_date.props);
    product.production_date = product.production_date.props
      ? product.production_date.props.originalDate
      : product.production_date;
    try {
      const res = handleUpdate(data._id, product, token);
      reloadData();
      NotifiUpdate();
      console.log(res);
      reloadData();
      reloadData();

      setProduct(product);
      reloadData();
    } catch (error) {
      console.log("Error update:", error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    if (!product.price || product.price <= 0) {
      newErrors.price = "giá phải lớn hơn 0 và không được để trống";
      isValid = false;
    }
    if (!product.quantity || product.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0 và không được để trống";
      isValid = false;
    }
    if (!product.net_weight || product.net_weight <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0 và không được để trống";
      isValid = false;
    }
    if (!isUpdate) {
      if (!selectedFarm) {
        newErrors.location = "Nơi xử lý đóng gói là bắt buộc.";
        isValid = false;
      }
      if (!selectedProductInfos) {
        newErrors.processor = "Thông tin loại sản phẩm là bắt buộc.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  let productionDate = ""; // Declare formattedDate variable

  if (
    product.production_date &&
    typeof product.production_date === "object" &&
    product.production_date.props
  ) {
    productionDate = product.production_date.props.originalDate;
  } else {
    productionDate = new Date(product.production_date);
  }
  let releaseDate = ""; // Declare formattedDate variable

  if (
    product.release_date &&
    typeof product.release_date === "object" &&
    product.release_date.props
  ) {
    releaseDate = product.release_date.props.originalDate;
  } else {
    releaseDate = new Date(product.release_date);
  }
  const FarmName = product.location && product.location ? product.location : "";

  return (
    <div>
      <div className="container_update">
        <ToastContainer />

        <div style={{ flex: 1, paddingRight: "1rem" }}>
          <h4>Tên sản phẩm</h4>
          {isProProduct ? (
            <>
              <InputText
                value={product.product_info.name}
                style={{ width: "100%" }}
              />
              <h4>Mô tả</h4>
              <InputTextarea
                autoResize
                value={product.product_info.description}
                style={{ width: "100%" }}
              />
              <h4>Phương pháp bảo quản</h4>
              <InputText
                value={product.product_info.storage_method}
                style={{ width: "100%" }}
              />
            </>
          ) : (
            <InputText
              disabled
              name="name"
              value={product.harvest.name}
              style={{ width: "100%" }}
              onChange={handleChange}
            />
          )}
          {errors.name && <small className="p-error">{errors.name}</small>}

          {!isProProduct && (
            <>
              <div className="input-container">
                <div style={{ width: "100%", marginRight: "2vh" }}>
                  <h4>Số lượng</h4>
                  <InputText
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    style={{ width: "100%" }}
                    onChange={handleChange}
                  />
                  {errors.quantity && (
                    <small className="p-error">{errors.quantity}</small>
                  )}
                </div>
                <div style={{ width: "100%", marginRight: "2vh" }}>
                  <h4>Khối lượng tịnh</h4>
                  <InputText
                    name="net_weight"
                    type="number"
                    value={product.net_weight}
                    autoResize
                    style={{ width: "100%" }}
                    onChange={handleChange}
                  />
                  {errors.net_weight && (
                    <small className="p-error">{errors.net_weight}</small>
                  )}
                </div>

                <div style={{ width: "100%" }}>
                  <h4>ĐVT</h4>
                  <Dropdown
                    name="unit"
                    value={product.unit}
                    options={unitOptions}
                    onChange={handleUnitChange}
                    placeholder="Đơn vị tính"
                    style={{ width: "100%" }}
                  />
                  {errors.unit && (
                    <small className="p-error">{errors.unit}</small>
                  )}
                </div>
              </div>
              <div className="input-container">
                <div style={{ width: "100%", marginRight: "2vh" }}>
                  <h4>Giá</h4>
                  <InputText
                    name="price"
                    type="number"
                    value={product.price}
                    autoResize
                    style={{ width: "100%" }}
                    onChange={handleChange}
                  />
                  {errors.price && (
                    <small className="p-error">{errors.price}</small>
                  )}
                </div>
                <div style={{ width: "100%" }}>
                  <h4>ĐV Tiền tệ</h4>
                  <Dropdown
                    name="currency_unit"
                    value={product.currency_unit}
                    options={currentunitOptions}
                    onChange={handleCurrencyUnitChange}
                    placeholder="Tiền tệ"
                    style={{ width: "100%" }}
                  />
                  {errors.currency_unit && (
                    <small className="p-error">{errors.currency_unit}</small>
                  )}
                </div>
              </div>

              <h4>Nơi đóng gói</h4>
              <Dropdown
                placeholder={FarmName}
                type="text"
                value={selectedFarm}
                options={Farms}
                optionLabel="name"
                onChange={(e) => {
                  setSelectedFarm(e.value);
                  product.location = e.value._id;
                }}
                style={{ width: "100%" }}
              />

              {errors.location && (
                <small className="p-error">{errors.location}</small>
              )}
            </>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div className="input-container">
            <div style={{ width: "100%", marginRight: "2vh" }}>
              <h4>Ngày sản xuất</h4>
              <Calendar
                name="production_date"
                style={{ width: "100%" }}
                value={
                  productionDate instanceof Date
                    ? productionDate
                    : new Date(productionDate)
                }
                onChange={handleChange}
              />

              {errors.production_date && (
                <small className="p-error">{errors.production_date}</small>
              )}
            </div>
            <div style={{ width: "100%" }}>
              {/* <h4>Ngày hết hạn</h4>
              <Calendar
                name="release_date"
                style={{ width: "100%" }}
                value={
                  releaseDate instanceof Date
                    ? releaseDate
                    : new Date(releaseDate)
                }
                onChange={handleChange}
              />
              {errors.release_date && (
                <small className="p-error">{errors.release_date}</small>
              )} */}
            </div>
          </div>
          <h4>Hạn sử dụng</h4>
          <InputTextarea
            type="number"
            name="dte"
            value={product.dte}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.dte && <small className="p-error">{errors.dte}</small>}
          {!isProProduct && (
            <div className="Product_info">
              {/* eslint-disable-next-line react/jsx-pascal-case */}
              <Product_Infos_Actives
                reloadData={reloadData}
                isProcessors={true}
                id_product_info={data.product_info}
              />
            </div>
          )}
        </div>
      </div>
      {!isProProduct && (
        <Button
          className="button_Dia"
          id="Save"
          label={isUpdate ? "Lưu" : "Tạo mới"}
          severity="success"
          onClick={handle}
        />
      )}
    </div>
  );
}

export default YourComponent;
