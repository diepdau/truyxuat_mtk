import React, { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ToastContainer } from "react-toastify";
import { NotifiUpdate } from "../../Design/Observable/index.js";
import "./CultivationLogs.css";
import { Calendar } from "primereact/calendar";
import ImageUploader from "../../../components/Images/Image";
import { handleUpdate} from "../../service/cultivationLog_data.js";
import { AuthContext } from "../../service/user_service.js";
const emptyProduct = {
  name: "",
  description: "",
  date: "",
};

function YourComponent({ reloadData, data }) {
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(data || emptyProduct);
  const [errors, setErrors] = useState({});
  var url = data ? `https://agriculture-traceability.vercel.app/api/v1/cultivation-logs/upload/${data._id}` : "";
  const handleChange = (event) => {
    const { value, name } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const handleChangeDate = (event) => {
    const { value, name } = event.target;
    let updatedDate = value;
    if (product.date.props) {
      updatedDate = product.date.props.originalDate;
    }
    setProduct({
      ...product,
      [name]: updatedDate,
    });
  };

  const handleCreate = async () => {
    if (!validate()) {
      return;
    }

    try {
      const response = handleUpdate(data._id, {
        name: product.name,
        description: product.description,
        date: formattedDate,
      },token);
      NotifiUpdate();
      reloadData();
      setProduct({
        ...product,
        name: product.data.name,
        description: response.data.description,
        date: response.data.date,
      });
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
    }

    setErrors(newErrors);
    return isValid;
  };
  let formattedDate = "";
  if (product.date && typeof product.date === "object" && product.date.props) {
    formattedDate = product.date.props.originalDate;
  } else {
    formattedDate = new Date(product.date);
  }
  return (
    <div>
            <ToastContainer />

      <div className="container_update ">
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          <h4>Tên</h4>
          <InputText
            name="name"
            defaultValue={product.name}
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
            value={
              formattedDate instanceof Date
                ? formattedDate
                : new Date(formattedDate)
            }
            onChange={handleChangeDate}
          />
          {errors.date && <small className="p-error">{errors.date}</small>}
          <Button
            className="button_Dia"
            id="Luu"
            label="Lưu"
            severity="success"
            onClick={handleCreate}
          />
        </div>

        {/* Cột phải */}
        <div className="hide-on-small-screen" style={{ flex: 1 }}>
          <h4 style={{ fontWeight: "bold" }}>Hình ảnh</h4>
          <ImageUploader
            uploadUrl={url}
            images={data.images}
            reloadData={reloadData}
          />
        </div>
      </div>
    </div>
  );
}

export default YourComponent;
