import React, { useState, useContext } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import ImageUploader from "../../../components/Images/Image";
import { handleCreate, handleUpdate } from "../../service/categories_data.js";
import { AuthContext } from "../../service/user_service.js";
import { ToastContainer } from "react-toastify";
import { NotifiCreate, NotifiUpdate } from "../../Design/Observable/index.js";

const emptyData = {
  name: "",
  description: "",
};

function YourNewComponent({ reloadData, data, isUpdate }) {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState(data || emptyData);
  const [errors, setErrors] = useState({});
  const images = isUpdate ? data.images : [];
  const url = isUpdate
    ? `https://agriculture-traceability.vercel.app/api/v1/categories/upload/${data._id}`
    : "";

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handle = async () => {
    if (!validate()) {
      return;
    }
    try {
      if (isUpdate) {
        const res = await handleUpdate(data._id, formData, token);
        NotifiUpdate();
        setFormData(res);
        reloadData();
      } else {
        await handleCreate(formData, token);
        NotifiCreate();
        setFormData(emptyData);
        reloadData();
      }
      reloadData();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Tên nhóm là bắt buộc.";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Mô tả là bắt buộc.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  return (
    <div>
      <div className="container_update_areas">
        <ToastContainer />
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          {/* Cột trái */}
          <h4>Tên nhóm</h4>
          <InputTextarea
            name="name"
            value={formData.name}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
          <h4>Mô tả</h4>
          <InputTextarea
            name="description"
            value={formData.description}
            style={{ width: "100%" }}
            onChange={handleChange}
            autoResize
          />
          {errors.description && (
            <small className="p-error">{errors.description}</small>
          )}

          <Button
            className="button_Dia"
            id="Save"
            label={isUpdate ? "Cập nhật" : "Lưu"}
            severity="success"
            onClick={handle}
          />
        </div>

        {isUpdate && (
          <div className="hide-on-small-screen" style={{ flex: 1 }}>
            <h4 style={{ fontWeight: "bold" }}>Hình ảnh</h4>
            <ImageUploader
              uploadUrl={url}
              images={images}
              reloadData={reloadData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default YourNewComponent;
