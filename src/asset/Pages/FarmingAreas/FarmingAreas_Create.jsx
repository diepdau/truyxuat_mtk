import React, { useState,  useContext } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ToastContainer } from "react-toastify";
import { NotifiCreate, NotifiUpdate } from "../../Design/Observable/index.js";
import "./FarmingAreas.css";
import { InputText } from "primereact/inputtext";
import Map123 from "../../../components/Map/Map";
import { handleCreate, handleUpdate } from "../../service/farm_data.js";
import { AuthContext } from "../../service/user_service.js";
const emptyData = {
  name: "",
  description: "",
  area: "",
  address: "",
  coordinates: [0, 0],
};

function YourNewComponent({ reloadData, data, isUpdate }) {
  const [formData, setFormData] = useState(data || emptyData);
  const [errors, setErrors] = useState({});
  const coo = isUpdate ? data.coordinates : [];
  const { token } = useContext(AuthContext);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  function convertStringArrayToNumberArray(arr) {
    console.log(arr);
    // return arr.split(",").map((item) => parseFloat(item, 10));
  }
  const handle = async () => {
    if (!validate()) {
      return;
    }

    formData.coordinates = convertStringArrayToNumberArray(
      formData.coordinates
    );
    try {
      if (data) {
        const res = handleUpdate(data._id, formData, token);
        NotifiUpdate();
        setFormData(res);
      } else {
        await handleCreate(formData, token);
        NotifiCreate();
        setFormData(emptyData);
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

    if (!formData.name && formData.name === "") {
      newErrors.name = "Tên là bắt buộc.";
      isValid = false;
    }

    if (!formData.description && formData.description === "") {
      newErrors.description = "Mô tả là bắt buộc.";
      isValid = false;
    }

    if (!formData.area && formData.area === "") {
      newErrors.area = "Diện tích là bắt buộc.";
      isValid = false;
    } else if (parseFloat(formData.area) < 0) {
      newErrors.area = "Diện tích không âm.";
      isValid = false;
    }

    if (!formData.address && formData.address === "") {
      newErrors.address = "Địa chỉ là bắt buộc.";
      isValid = false;
    }
    if (!formData.coordinates && formData.coordinates === "") {
      newErrors.coordinates = "Tọa độ là bắt buộc.";
      isValid = false;
    } else {
      if (formData.coordinates[0] === 0 && formData.coordinates[1] === 0) {
        newErrors.coordinates = "Tọa độ là bắt buộc.";
        isValid = false;
      } else {
        if (!isUpdate) {
          const coordinatesArray = formData.coordinates.split(",").map(Number);
          if (
            coordinatesArray.length !== 2 ||
            coordinatesArray.some((coord) => isNaN(coord)) ||
            coordinatesArray.some((coord) => coord <= 0)
          ) {
            newErrors.coordinates =
              "Tọa độ chưa đúng định dạng và phải lớn hơn hoặc khác không.";
            isValid = false;
          }
        }
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  return (
    <div>
      <ToastContainer />

      <div className="container_update_areas">
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          {/* Cột trái */}

          <h4>Tên cơ sở</h4>
          <InputTextarea
            name="name"
            value={formData.name}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
          <h4>Diện tích</h4>
          <InputText
            type="number"
            name="area"
            value={formData.area}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.area && <small className="p-error">{errors.area}</small>}
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
        </div>
        {/* Cột phải */}
        <div style={{ flex: 1 }}>
          <h4>Địa chỉ</h4>
          <InputTextarea
            name="address"
            value={formData.address}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.address && (
            <small className="p-error">{errors.address}</small>
          )}

          <h4>Tọa độ</h4>
          <InputText
            type="text"
            name="coordinates"
            value={formData.coordinates}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.coordinates && (
            <small className="p-error">{errors.coordinates}</small>
          )}
          {isUpdate ? <Map123 coordinates={coo} nameAres={data.address} /> : ""}
        </div>
      </div>
      <Button
        className="button_Dia"
        id="Save"
        label={isUpdate ? "Cập nhật" : "Lưu"}
        severity="success"
        onClick={handle}
      />
    </div>
  );
}

export default YourNewComponent;
