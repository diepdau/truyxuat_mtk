import React, { useState, useRef, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  NotifiUpdate,
  NotifiCreate,
} from "../../Design/Observable/index.js";
import "./Medicine.css";
import { InputTextarea } from "primereact/inputtextarea";
import { handleCreate, handleUpdate } from "../../service/medicine_data.js";
import { AuthContext } from "../../service/user_service.js";
const emptyProduct = {
  name: "",
  description: "",
  ingredients: "",
  usage_instruction: "",
  toxicity: "",
  dosage: "",
  isolation: "",
  recommendation: "",
  certificate: "",
};

function YourComponent({ data, reloadData, isUpdate }) {
  const [product, setProduct] = useState(data || emptyProduct);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const { token } = useContext(AuthContext);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      let response;
      if (data) {
        response = await handleUpdate(data._id, product, token);
        NotifiUpdate();
        setProduct(response.data);
      } else {
        response = await handleCreate(product, token);
        NotifiCreate();
        setProduct(emptyProduct);
      }
      reloadData();
      reloadData();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (product.name.trim() === "") {
      newErrors.name = "Tên là bắt buộc.";
      isValid = false;
    }
    if (product.description.trim() === "") {
      newErrors.description = "Mô tả là bắt buộc.";
      isValid = false;
    }
    if (product.ingredients.trim() === "") {
      newErrors.ingredients = "Thành phần là băt buộc.";
      isValid = false;
    }
    if (product.usage_instruction.trim() === "") {
      newErrors.usage_instruction = "Hướng dẫn sử dụng là bắt buộc.";
      isValid = false;
    }
    if (product.toxicity.trim() === "") {
      newErrors.toxicity = "Độ độc là bắt buộc.";
      isValid = false;
    }
    if (product.dosage.trim() === "") {
      newErrors.dosage = "Liều lượng là bắt buộc.";
      isValid = false;
    }
    if (product.isolation.trim() === "") {
      newErrors.isolation = "Cách ly là bắt buộc.";
      isValid = false;
    }
    if (product.recommendation.trim() === "") {
      newErrors.recommendation = "Khuyến nghị là bắt buộc.";
      isValid = false;
    }
    if (product.certificate.trim() === "") {
      newErrors.certificate = "Giấy phép là bắt buộc.";
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
          <div>
            <h4>Tên</h4>
            <InputText
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
            <h4>Thành phần</h4>
            <InputTextarea
              name="ingredients"
              value={product.ingredients}
              autoResize
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.ingredients && (
              <small className="p-error">{errors.ingredients}</small>
            )}
            <h4>Hướng dẫn sử dụng</h4>
            <InputTextarea
              name="usage_instruction"
              value={product.usage_instruction}
              autoResize
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.usage_instruction && (
              <small className="p-error">{errors.usage_instruction}</small>
            )}
          </div>
        </div>
        {/* Cột phải */}
        <div style={{ flex: 1 }}>
          <div>
            <h4>Độ độc</h4>
            <InputTextarea
              name="toxicity"
              value={product.toxicity}
              autoResize
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.toxicity && (
              <small className="p-error">{errors.toxicity}</small>
            )}
            <h4>Liều lượng</h4>
            <InputTextarea
              name="dosage"
              value={product.dosage}
              autoResize
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.dosage && (
              <small className="p-error">{errors.dosage}</small>
            )}
            <h4>Cách ly</h4>
            <InputTextarea
              name="isolation"
              value={product.isolation}
              autoResize
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.isolation && (
              <small className="p-error">{errors.isolation}</small>
            )}
            <h4>Khuyến nghị</h4>
            <InputTextarea
              name="recommendation"
              value={product.recommendation}
              autoResize
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.recommendation && (
              <small className="p-error">{errors.recommendation}</small>
            )}
            <h4>Giấy phép</h4>
            <InputTextarea
              name="certificate"
              value={product.certificate}
              autoResize
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.certificate && (
              <small className="p-error">{errors.certificate}</small>
            )}
          </div>
        </div>
      </div>
      <Button
        className="button_Dia"
        id="Save"
        label={data ? "Cập nhật" : "Thêm mới"}
        severity="success"
        onClick={handleSave}
      />
    </div>
  );
}

export default YourComponent;
