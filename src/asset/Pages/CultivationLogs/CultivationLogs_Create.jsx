import React, { useState, useContext } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { NotifiCreate } from "../../Design/Observable/index.js";
import "./CultivationLogs.css";
import { Calendar } from "primereact/calendar";
import { handleCreate } from "../../service/cultivationLog_data.js";
import { AuthContext } from "../../service/user_service.js";
const emptyProduct = {
  name: "",
  description: "",
  date: new Date(), // Lấy ngày hiện tại dưới dạng chuỗi
};

function YourComponent({ reloadData, herd_id }) {
  const [product, setProduct] = useState(emptyProduct);
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  const handleChange = (event) => {
    const { value, name } = event.target;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handle = async () => {
    if (!validate()) {
      return;
    }

    try {
      const dateString = product.date;
      const data = {
        name: product.name,
        description: product.description,
        date: dateString,
        herd: herd_id,
      };
      handleCreate(data, token);
      reloadData();
      setProduct(emptyProduct);
      NotifiCreate();
      reloadData();

      reloadData();

    } catch (error) {
      console.log("Error update:", error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Tên là bắt buộc .";
      isValid = false;
    }

    if (!product.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div>
      <h4>Tên</h4>
      <InputTextarea
        name="name"
        value={product.name}
        style={{ width: "100%" }}
        onChange={handleChange}
      />
      {errors.name && <small className="p-error">{errors.name}</small>}

      <h4>Mô tả</h4>
      <InputTextarea
        name="description"
        value={product.description}
        autoResize
        style={{ width: "100%" }}
        onChange={handleChange}
      />
      {errors.description && (
        <small className="p-error">{errors.description}</small>
      )}

      <h4>Ngày</h4>
      <Calendar
        inputId="cal_date"
        name="date"
        style={{ width: "100%" }}
        value={product.date}
        onChange={handleChange}
      />
      {errors.date && <small className="p-error">{errors.date}</small>}

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

export default YourComponent;
