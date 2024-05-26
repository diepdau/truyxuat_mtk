import React, { useState, useRef, useEffect, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./ProductPatchs.css";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { NotifiCreate } from "../../Design/Observable/index.js";
import {
  handleCreate,
  getProductInfos,
  getProduct,
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
  product_info: "",
  currency_unit: null,
  production_date: new Date(),
};
const unitOptions = [
  { label: "Kg", value: "Kg" },
  { label: "Túi", value: "Túi" },
  { label: "Lít", value: "Lít" },
];

const currentUnitOptions = [
  { label: "VND", value: "VND" },
  { label: "$", value: "$" },
];
function YourComponent({ reloadData, isUpdate }) {
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(emptyProduct);
  const [errors, setErrors] = useState({});
  const [ProductInfos, setProductInfos] = useState({});
  const [selectedProductInfos, setSelectedProductInfos] = useState(null);
  const [productDescription, setProductDescription] = useState("");
  const [isQuantity, setIsQuantity] = useState("");

  const [Products, setProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [Farms, setFarms] = useState({});
  const [selectedFarm, setSelectedFarm] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    setProductInfos(await getProductInfos());
    setProducts(await getProduct());
    setFarms(await getFarm());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const handleUnitChange = (event) => {
    setProduct({
      ...product,
      unit: event.value,
    });
  };
  const handleCurrentUnitChange = (event) => {
    setProduct({
      ...product,
      currency_unit: event.value,
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

    try {
      const res = handleCreate(product, token);
      reloadData();
      NotifiCreate();
      reloadData();
      console.log(res);
      reloadData();
      setProduct(emptyProduct);
      reloadData();
    } catch (error) {
      console.log("Error update:", error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    if (!product.price || product.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0 và không được để trống";
      isValid = false;
    }
    if (!product.quantity || product.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0 và không được để trống";
      isValid = false;
    }
    if (!product.net_weight || product.net_weight <= 0) {
      newErrors.quantity =
        "Khối lượng tịnh phải lớn hơn 0 và không được để trống";
      isValid = false;
    }
    if (product.net_weight * product.quantity >= isQuantity) {
      newErrors.quantity = "Tổng SL sản phẩm ít hơn sản phẩm thô";
      isValid = false;
    }

    if (!isUpdate) {
      if (!selectedProduct) {
        newErrors.product = "Sản phẩm là bắt nuộc.";
        isValid = false;
      }
      if (!selectedFarm) {
        newErrors.location = "Vị trí là bắt buộc.";
        isValid = false;
      }
      if (!selectedProductInfos) {
        newErrors.processor = "Thông tin là bắt buộc.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };
  const ProductName =
    product.product && product.product.name ? product.product.name : "";
  const ProductInfosName =
    product.productInfos && product.productInfos.name
      ? product.productInfos.name
      : "";
  const FarmName =
    product.location && product.location.name ? product.location.name : "";
  return (
    <div>
      <div className="container_update">
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          <div className="input-container">
            <div style={{ width: "100%", marginRight: "2vh", flex: "3" }}>
              <h4>Sản phẩm</h4>
              <Dropdown
                placeholder={ProductName}
                type="text"
                value={selectedProduct}
                options={Products}
                optionLabel="name"
                onChange={(e) => {
                  setSelectedProduct(e.value);
                  product.harvest = e.value._id;
                  setIsQuantity(e.value.quantity);
                }}
                style={{ width: "100%" }}
                itemTemplate={(option) => (
                  <div className="p-clearfix">
                    <i
                      className={classNames("pi", {
                        "text-green-500 pi-check-circle": option.isProcessed,
                        "text-red-500 pi-times-circle": !option.isProcessed,
                      })}
                      style={{ float: "left", marginRight: ".5em" }}
                    ></i>
                    <span>{option.name}</span>
                  </div>
                )}
              />
              {errors.product && (
                <small className="p-error">{errors.product}</small>
              )}
            </div>
            <div style={{ width: "100%", flex: "1" }}>
              <h4>&nbsp;</h4>
              <InputText
                disabled
                value={"SL: " + isQuantity}
                style={{ width: "100%" }}
              />
            </div>
          </div>
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
              <h4>KL tịnh</h4>
              <InputText
                name="net_weight"
                type="number"
                value={product.net_weight}
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
                name="Đơn vị tính"
                value={product.unit}
                options={unitOptions}
                onChange={handleUnitChange}
                style={{ width: "100%" }}
              />
              {errors.unit && <small className="p-error">{errors.unit}</small>}
            </div>
          </div>
          <div className="input-container">
            <div style={{ width: "100%", marginRight: "2vh" }}>
              <h4>Giá</h4>
              <InputText
                type="number"
                name="price"
                value={product.price}
                style={{ width: "100%" }}
                onChange={handleChange}
              />
              {errors.price && (
                <small className="p-error">{errors.price}</small>
              )}
            </div>
            <div style={{ width: "100%" }}>
              <h4>ĐV tiền tệ</h4>
              <Dropdown
                name="currency_unit"
                value={product.currency_unit}
                options={currentUnitOptions}
                onChange={handleCurrentUnitChange}
                placeholder="Đơn vị tiền tệ"
                style={{ width: "100%" }}
              />
              {errors.currency_unit && (
                <small className="p-error">{errors.currency_unit}</small>
              )}
            </div>
          </div>
          <h4>Vị trí</h4>
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
        </div>
        <div style={{ flex: 1 }}>
          <div className="input-container">
            <div style={{ width: "100%", marginRight: "2vh" }}>
              <h4>Ngày sản xuất</h4>
              <Calendar
                // inputId="cal_date"
                name="production_date"
                style={{ width: "100%" }}
                // value={
                //   productionDate instanceof Date
                //     ? productionDate
                //     : new Date(productionDate)
                // }
                value={product.production_date}
                onChange={handleChange}
              />

              {errors.production_date && (
                <small className="p-error">{errors.production_date}</small>
              )}
            </div>
            {/* <div style={{ width: "100%" }}>
              <h4>Ngày hết hạn</h4>
              <Calendar
                inputId="cal_date"
                name="dte"
                style={{ width: "100%" }}
                // value={
                //   releaseDate instanceof Date ? releaseDate : new Date(releaseDate)
                // }
                onChange={handleChange}
              />
            </div> */}
          </div>
          <h4>Hạn sử dụng</h4>
          <InputText
            name="dte"
            value={product.dte}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.dte && <small className="p-error">{errors.dte}</small>}
          <div className="Product_info">
            <h4>Thông tin loại</h4>
            <Dropdown
              placeholder={ProductInfosName}
              type="text"
              value={selectedProductInfos}
              options={ProductInfos}
              optionLabel="name"
              onChange={handleProductChange}
              style={{ width: "100%" }}
            />
            {errors.productInfos && (
              <small className="p-error">{errors.productInfos}</small>
            )}
            <h4>Mô tả</h4>
            <InputTextarea
              readOnly
              autoResize
              value={productDescription}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
      <Button
        className="button_Dia"
        id="Save"
        label={isUpdate ? "Lưu" : "Tạo mới"}
        severity="success"
        onClick={handle}
      />
    </div>
  );
}

export default YourComponent;
