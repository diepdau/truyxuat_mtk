import React, { useState, useRef, useEffect ,useContext} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./Product_Infos.css";
import { InputTextarea } from "primereact/inputtextarea";
import { handleCreate,handleGetProductInfor,handleUpdate} from "../../service/productInfor_data.js";
import { AuthContext } from "../../service/user_service.js";
import { ToastContainer } from "react-toastify";
import { NotifiUpdate,NotifiCreate } from "../../Design/Observable/index.js";
const emptyProduct = {
  _id: "",
  name: "",
  description: "",
  storage_method: "",
};

function YourComponent({
  data,
  reloadData,
  isUpdate,
  isProcessors,
  id_product_info,
}) {
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

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    if (id_product_info) {
      try {
        const a = await handleGetProductInfor(id_product_info,token)
        setProduct(a.data.productInfo);
      } catch (error) {
        console.log("Error", error);
      }
    }
  };
  const handle = async () => {
    if (!validate()) {
      return;
    }

    try {
      if (data) {
        await handleUpdate(data._id,product,token);
        NotifiUpdate();
        setProduct({
          ...product,
        });
      } else {
        await handleCreate(product,token);
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

    // Validate name
    if (!product.name || product.name.trim() === "") {
      newErrors.name = "Tên không được để trống";
      isValid = false;
    }

    // Validate description
    if (!product.description || product.description.trim() === "") {
      newErrors.description = "Mô tả không được để trống";
      isValid = false;
    }

    // Validate storage method
    if (!product.storage_method || product.storage_method.trim() === "") {
      newErrors.storage_method = "Phương pháp bảo quản không được để trống";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  return (
    <div>      <ToastContainer />
      <div className="container_update">
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          <h4>Loại sản phẩm</h4>
          <InputText
            name="name"
            value={product.name}
            style={{ width: "100%" }}
            onChange={handleChange}
            readOnly={isProcessors}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}

          <h4>Phương pháp bảo quản</h4>
          <InputTextarea
            autoResize
            name="storage_method"
            value={product.storage_method}
            style={{ width: "100%" }}
            onChange={handleChange}
            disabled={isProcessors}
          />
          {errors.storage_method && (
            <small className="p-error">{errors.storage_method}</small>
          )}
          {isProcessors && (
            <>
              <h4>Mô tả</h4>
              <InputTextarea
                autoResize
                name="description"
                value={product.description}
                style={{ width: "100%" }}
                onChange={handleChange}
                readOnly={isProcessors}
              />
            </>
          )}
        </div>
        {!isProcessors && (
          <div style={{ flex: 1 }}>
            <h4>Mô tả</h4>
            <InputTextarea
              autoResize
              name="description"
              value={product.description}
              style={{ width: "100%" }}
              onChange={handleChange}
            />
            {errors.description && (
              <small className="p-error">{errors.description}</small>
            )}
          </div>
        )}
      </div>
      {!isProcessors && (
        <Button
          className="button_Dia"
          id="Save"
          label={isUpdate ? "Cập nhật" : "Lưu"}
          severity="success"
          onClick={handle}
        />
      )}
    </div>
  );
}

export default YourComponent;
