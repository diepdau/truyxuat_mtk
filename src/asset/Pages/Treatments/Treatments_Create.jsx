import React, { useState, useRef, useEffect, useContext } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import "./Treatments.css";
import typeOptions from "./Type.jsx";
import { handleCreate, handleUpdate } from "../../service/treatment_data.js";
import { getHerd } from "../../service/harvest_data.js";
import { AuthContext } from "../../service/user_service.js";
import { NotifiUpdate,NotifiCreate} from "../../Design/Observable/index.js";
const emptyProduct = {
  herd: "",
  type: "",
  product: "",
  amount: "",
  mode: "",
  description: "",
  date: new Date(),
  retreat_date: "",
  site: "",
  technician: "",
};
const modeOptions = [
  "Tiêm bắp (trong cơ)",
  "Intrammary (trong bầu vú)",
  "Trong tử cung",
  "Tiêm tĩnh mạch",
  "Miệng (trong miệng)",
  "Tiêm dưới da",
  "Bôi ngoài (trên da)",
  "Khác",
];
const siteOptions = ["Mông", "Sườn", "Cổ", "Khác"];

function YourComponent({ idherd,data, reloadData, isUpdate, nameherd }) {
  const [product, setProduct] = useState(data || emptyProduct);
  const [errors, setErrors] = useState({});
  const [herds, setHerds] = useState({});
  const [selectedHerd, setSelectedHerd] = useState(null);
  const toast = useRef(null);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    getAllHerd();
  }, []);

  const getAllHerd = async () => {
    const a = await getHerd();
    setHerds(a.data.herds);
    if (idherd) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        herd: idherd,
      }));
    }
  };

  const handleTypeChange = (event) => {
    setProduct({
      ...product,
      type: event.value,
    });
  };
  const handleModeChange = (event) => {
    setProduct({
      ...product,
      mode: event.value,
    });
  };
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
      if (isUpdate) {
        product.date = product.date.props
          ? product.date.props.originalDate
          : product.date;
        product.retreat_date = product.retreat_date.props
          ? product.retreat_date.props.originalDate
          : product.retreat_date;
        await handleUpdate(data._id, product, token);
        NotifiUpdate();
        setProduct(product);
      } else {
        await handleCreate(product, token);
        NotifiCreate();
        reloadData();
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

    if (product.type.trim() === "") {
      newErrors.type = "Loại là bắt buộc.";
      isValid = false;
    }

    if (product.description.trim() === "") {
      newErrors.description = "Mô tả là bắt buộc.";
      isValid = false;
    }

    if (product.amount.trim() === "") {
      newErrors.amount = "Liều lượng là bắt buộc.";
      isValid = false;
    }

    if (product.product.trim() === "") {
      newErrors.product = "Thuốc là bắt buộc.";
      isValid = false;
    }
    if ((isValid && dateDate >= retreatDate) || dateDate === retreatDate) {
      newErrors.date = "Ngày tiến hành phải nhỏ hơn ngày hết hạn";
      newErrors.retreat_date = "Ngày rút phải lớn hơn ngày sản xuất";
      isValid = false;
    }
    if (product.site.trim() === "") {
      newErrors.site = "Vị trí là bắt buộc.";
      isValid = false;
    }

    if (product.technician.trim() === "") {
      newErrors.technician = "Kĩ thuật là bắt buộc.";
      isValid = false;
    }
    if (product.mode.trim() === "") {
      newErrors.mode = "Hình thức điều trị là bắt buộc.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const herdName =
    product.herd && product.herd.name ? product.herd.name : nameherd;
  let dateDate = ""; // Declare formattedDate variable

  if (product.date && typeof product.date === "object" && product.date.props) {
    dateDate = product.date.props.originalDate;
  } else {
    dateDate = new Date(product.date);
  }
  let retreatDate = ""; // Declare formattedDate variable

  if (
    product.retreat_date &&
    typeof product.retreat_date === "object" &&
    product.retreat_date.props
  ) {
    retreatDate = product.retreat_date.props.originalDate;
  } else {
    retreatDate = new Date(product.retreat_date);
  }
  return (
    <div>
      <div className="container_update">
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          {idherd ? (
            ""
          ) : (
            <>
              <h4>Đàn</h4>
              <Dropdown
                placeholder={herdName}
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
              {errors.farm_product && (
                <small className="p-error">{errors.farm_product}</small>
              )}
            </>
          )}
          <h4>Loại</h4>
          <Dropdown
            name="type"
            value={product.type}
            options={typeOptions}
            onChange={handleTypeChange}
            placeholder={product.type}
            style={{ width: "100%" }}
          />
          {errors.type && <small className="p-error">{errors.type}</small>}
          <h4>Thuốc sử dụng</h4>
          <InputTextarea
            name="product"
            value={product.product}
            style={{ width: "100%" }}
            onChange={handleChange}
            autoResize
          />
          {errors.product && (
            <small className="p-error">{errors.product}</small>
          )}
          <h4>Liều lượng</h4>
          <InputTextarea
            name="amount"
            value={product.amount}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
          {errors.amount && <small className="p-error">{errors.amount}</small>}
          <h4>Hình thức điều trị</h4>
          <Dropdown
            name="mode"
            value={product.mode}
            options={modeOptions}
            onChange={handleModeChange}
            placeholder={product.mode}
            style={{ width: "100%" }}
          />

          {errors.mode && <small className="p-error">{errors.mode}</small>}
        </div>

        {/* Cột phải */}
        <div style={{ flex: 1 }}>
          <h4>Mô tả</h4>
          <InputTextarea
            name="description"
            value={product.description}
            style={{ width: "100%" }}
            onChange={handleChange}
            autoResize
          />
          {errors.description && (
            <small className="p-error">{errors.description}</small>
          )}
          <h4>Vị trí</h4>
          <Dropdown
            name="site"
            value={product.site}
            style={{ width: "100%" }}
            onChange={handleChange}
            options={siteOptions}
            placeholder={product.site}
          />
          {errors.site && <small className="p-error">{errors.site}</small>}

          <h4>Kĩ thuật</h4>
          <InputTextarea
            name="technician"
            value={product.technician}
            style={{ width: "100%" }}
            onChange={handleChange}
            autoResize
          />
          {errors.technician && (
            <small className="p-error">{errors.technician}</small>
          )}

          <h4>Ngày tiến hành</h4>
          <Calendar
            inputId="cal_production_date"
            name="date"
            style={{ width: "100%" }}
            value={dateDate instanceof Date ? dateDate : new Date(dateDate)}
            onChange={handleChange}
          />
          {errors.date && <small className="p-error">{errors.date}</small>}
          <h4>Ngày rút</h4>
          <Calendar
            inputId="cal_expiration_date"
            name="retreat_date"
            style={{ width: "100%" }}
            value={
              retreatDate instanceof Date ? retreatDate : new Date(retreatDate)
            }
            onChange={handleChange}
          />
          {errors.retreat_date && (
            <small className="p-error">{errors.retreat_date}</small>
          )}
        </div>
      </div>
      <Button
        className="button_Dia"
        id="Luu"
        label={isUpdate ? "Cập nhật" : "Lưu"}
        severity="success"
        onClick={handle}
      />
    </div>
  );
}

export default YourComponent;
