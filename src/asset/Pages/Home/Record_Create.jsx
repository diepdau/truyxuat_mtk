import React, { useState, useRef, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import {
  handleCreateAnimal,
  handleUpdateAnimal,
} from "../../service/Herd_data.js";
import { AuthContext } from "../../service/user_service.js";
import { ToastContainer } from "react-toastify";
import { NotifiCreate } from "../../Design/Observable/index.js";

const emptyProduct = {
  _id: null,
  name: "",
  birth_weight: "",
  birth_date: new Date(),
  is_harvested: "",
  quantity: 0,
  herd: "",
};

function YourComponent({ herdId, data, reloadData, isUpdate }) {
  const [product, setProduct] = useState(data || emptyProduct);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const { token } = useContext(AuthContext);
  const Is_harvested = [{ name: "true" }, { name: "false" }];
  const [selectedIsHarvested, setSelectedIsHarvested] = useState(emptyProduct);
  const handleChange = (event) => {
    const { value, name } = event.target;
    const newValue = name === "birth_date" ? value.toISOString() : value;
    setProduct({
      ...product,
      [name]: newValue,
    });
  };

  const handleCreate = async () => {
    if (!validate()) {
      return;
    }

    try {
      if (isUpdate) {
        await handleUpdateAnimal(data._id, product, token);
        console.log(product);
        toast.current.show({
          severity: "success",
          summary: "Sửa hoàn thành",
          life: 3000,
        });
      } else {
        await handleCreateAnimal(
          {
            name: product.name,
            birth_date: product.birth_date,
            birth_weight: product.birth_weight,
            is_harvested: selectedIsHarvested.name,
            herd: herdId,
          },
          token
        );
        NotifiCreate();
        setProduct(emptyProduct);
      }
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
      newErrors.name = "Tên là bắt buộc.";
      isValid = false;
    }
    if (!product.birth_weight.trim()) {
      newErrors.birth_weight = "Cân nặng là bắt buộc.";
      isValid = false;
    }
    if (parseFloat(product.birth_weight) <= 0) {
      newErrors.birth_weight = "Cân nặng lớn hơn 0.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div>
      <ToastContainer />
      <div className="container_update">
        <div
          style={{
            flex: 1,
            paddingRight: "1rem",
          }}
        >
          <h4>Tên</h4>
          <InputText
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
          <h4>Ngày sinh</h4>
          <Calendar
            inputId="cal_date"
            name="date"
            style={{ width: "100%" }}
            value={product.birth_date}
            onChange={handleChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4>Cân nặng</h4>
          <InputText
            type="number"
            name="birth_weight"
            value={product.birth_weight}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
          {errors.birth_weight && (
            <small className="p-error">{errors.birth_weight}</small>
          )}

          <h4>Thu hoạch</h4>
          <Dropdown
            type="text"
            options={Is_harvested}
            optionLabel="name"
            value={selectedIsHarvested}
            onChange={(e) => setSelectedIsHarvested(e.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <Button
        className="button_Dia"
        id="Save"
        label={isUpdate ? "Cập nhật" : "Lưu"}
        severity="success"
        onClick={handleCreate}
      />
    </div>
  );
}

export default YourComponent;
