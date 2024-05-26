import React, { useState,  useContext } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ToastContainer } from "react-toastify";
import { NotifiCreate } from "../../Design/Observable/index.js";
import { handleCreate } from "../../service/disease_data.js";
import { AuthContext } from "../../service/user_service.js";
import "./Diseases.css";
const emptyProduct = {
  name: "",
  description: "",
  symptoms: "",
  preventive_measures: "",
};

function YourComponent({ reloadData }) {
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
      const data = {
        name: product.name,
        description: product.description,
        symptoms: product.symptoms,
        preventive_measures: product.preventive_measures,
      };
      handleCreate(data, token);
      reloadData();
      reloadData();
      NotifiCreate();
      setProduct(emptyProduct);
    } catch (error) {
      console.log("Error update:", error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    // Kiểm tra lỗi cho trường name
    if (!product.name.trim()) {
      newErrors.name = "Tên là bắt buộc.";
      isValid = false;
    }

    // Kiểm tra lỗi cho trường description
    if (!product.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc.";
      isValid = false;
    } else if (product.description.trim().length < 20) {
      newErrors.description = "Mô tả ít nhất 20 kí tự.";
      isValid = false;
    }

    // Kiểm tra lỗi cho trường symptoms
    if (!product.symptoms.trim()) {
      newErrors.symptoms = "Triệu chứng là bắt buộc.";
      isValid = false;
    }

    // Kiểm tra lỗi cho trường preventive_measures
    if (!product.preventive_measures.trim()) {
      newErrors.preventive_measures = "Biện pháp phòng ngừa là bắt buộc.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div>
      <ToastContainer />
      <div className="container_update_areas">
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          <h4>Tên</h4>
          <InputTextarea
            name="name"
            value={product.name}
            autoResize
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
        </div>
        <div style={{ flex: 1 }}>
          <h4>Triệu chứng</h4>
          <InputTextarea
            name="symptoms"
            value={product.symptoms}
            autoResize
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.symptoms && (
            <small className="p-error">{errors.symptoms}</small>
          )}

          <h4>Biện pháp phòng ngừa</h4>
          <InputTextarea
            name="preventive_measures"
            value={product.preventive_measures}
            autoResize
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.preventive_measures && (
            <small className="p-error">{errors.preventive_measures}</small>
          )}
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

export default YourComponent;
