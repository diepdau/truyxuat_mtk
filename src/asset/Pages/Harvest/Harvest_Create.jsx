import React, { useState, useRef, useEffect, useContext } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import "./Harvest.css";
import { InputText } from "primereact/inputtext";
import { handleCreate, getHerd } from "../../service/harvest_data.js";
import { AuthContext } from "../../service/user_service.js";
import { NotifiCreate } from "../../Design/Observable/index.js";
const emptyProduct = {
  herd: "",
  name: "",
  quantity: "",
  unit: null,
  date: new Date(),
  description: "",
  status: "",
};
const unitOptions = [
  { label: "Cân", value: "Cân" },
  { label: "Kg", value: "Kg" },
  { label: "Túi", value: "Túi" },
  { label: "Lít", value: "Lít" },
];

const statusOptions = [
  { label: "Chưa thu hoạch", value: "Chưa thu hoạch" },
  { label: "Đang thu hoạch", value: "Đang thu hoạch" },
  { label: "Đã thu hoạch", value: "Đã thu hoạch" },
];
function Harvest_Create({ reloadData, idherd }) {
  const [product, setProduct] = useState(emptyProduct);
  const [errors, setErrors] = useState({});
  const [herds, setHerds] = useState({});
  const [selectedHerd, setSelectedHerd] = useState(null);
  const { token } = useContext(AuthContext);
  const toast = useRef(null);
  useEffect(() => {
    getHerdData();
  }, []);
  const getHerdData = async () => {
    try {
      const a = await getHerd();
      setHerds(a.data.herds);
      if (idherd) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          herd: idherd,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
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
  const handleStatusChange = (event) => {
    setProduct({
      ...product,
      status: event.value,
    });
  };
  const handle = async () => {
    if (!validate()) {
      return;
    }
    try {
      await handleCreate(product, token);
      NotifiCreate();
      reloadData();
      setProduct(emptyProduct);
      reloadData();
      reloadData();
    } catch (error) {
      const er = error.response.data.msg;
      if (er.includes("has been harvested")) {
        toast.current.show({
          severity: "warn",
          summary: "Đàn này đã thu hoạch xong",
          life: 3000,
        });
      }
      console.log("Error update:", error);
    }
    reloadData();
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    // Validate herd
    if (!product.herd.trim()) {
      newErrors.herd = "Đàn là bắt buộc.";
      isValid = false;
    }

    // Validate name
    if (!product.name.trim()) {
      newErrors.name = "Tên là bắt buộc.";
      isValid = false;
    }

    // Validate quantity
    if (!product.quantity || product.quantity <= 0) {
      newErrors.quantity = "Số lượng là bắt buộc và lớn hơn 0";
      isValid = false;
    }

    // Validate unit
    if (!product.unit) {
      newErrors.unit = "Đơn vị tính là bắt buộc.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Cột trái */}
        <div style={{ flex: 1 }}>
          <Toast className="toast" ref={toast} />

          {idherd ? (
            ""
          ) : (
            <>
              <h4>Đàn</h4>

              <Dropdown
                type="text"
                value={selectedHerd}
                options={herds}
                optionLabel="name"
                onChange={(e) => {
                  setSelectedHerd(e.value);
                  product.herd = e.value._id;
                }}
                style={{ width: "100%" }}
              />
              {errors.herd && <small className="p-error">{errors.herd}</small>}
            </>
          )}
          <h4>Tên sản phẩm</h4>
          <InputTextarea
            name="name"
            value={product.name}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
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
            <div style={{ width: "100%" }}>
              <h4>ĐVT</h4>
              <Dropdown
                name="Đơn vị tính"
                value={product.unit}
                options={unitOptions}
                onChange={handleUnitChange}
                placeholder="Chọn đơn vị tính"
                style={{ width: "100%" }}
              />
              {errors.unit && <small className="p-error">{errors.unit}</small>}
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div style={{ flex: 1 }}>
          <h4>Trạng thái</h4>
          <Dropdown
            name="status"
            value={product.status}
            options={statusOptions}
            onChange={handleStatusChange}
            placeholder="Chọn trạng thái"
            style={{ width: "100%" }}
          />
          <h4>Mô tả</h4>
          <InputTextarea
            name="description"
            value={product.description}
            autoResize
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {/* {errors.description && (
            <small className="p-error">{errors.description}</small>
          )} */}

          <h4>Ngày</h4>
          <Calendar
            inputId="cal_date"
            name="date"
            style={{ width: "100%" }}
            value={product.date}
            onChange={handleChange}
          />
        </div>
      </div>
      <Button
        className="button_Dia"
        id="Luu"
        label="Lưu"
        severity="success"
        onClick={handle}
      />
    </div>
  );
}

export default Harvest_Create;
