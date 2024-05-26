import React, { useRef, useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Galleria } from "primereact/galleria";
import { InputText } from "primereact/inputtext";
import { AuthContext } from "../../asset/service/user_service.js";
import "./Image.css";
import { NotifiCreate } from "../../asset/Design/Observable/index.js";
const ImageUploader = ({  uploadUrl, images, reloadData }) => {
  
  const { token } = useContext(AuthContext);
  const [err, setError] = useState(null);

  const { register, handleSubmit } = useForm();
  const toast = useRef(null);
  const upLoadImage = async (data) => {
    const formData = new FormData();
    for (const file of data.file) {
      formData.append("images", file);
    }
    try {
      await axios.patch(uploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      NotifiCreate();
      reloadData();
    } catch (error) {
      const er = error.response.data.msg;
      if (er?.includes("large")) {
        setError("File quá lớn");
      }
      console.log("Error img:", error);
    }
  };

  const thumbnailTemplate = (item) => (
    <img
      src={item.path}
      alt={item.name}
      style={{ width: "50%", overflow: "hidden", maxHeight: "200px" }}
    />
  );

  const thumbnail = (item) => (
    <img
      src={item.path}
      alt={item.name}
      style={{ width: "100%", overflow: "hidden", maxHeight: "400px" }}
    />
  );

  return (
    <div>
      {err && toast.error({err})}
      <Galleria
        className="Image_animals"
        value={images}
        numVisible={5}
        circular
        showItemNavigators
        showItemNavigatorsOnHover
        showIndicators
        showThumbnails={false}
        style={{ maxWidth: "640px" }}
        item={thumbnail}
        thumbnail={thumbnailTemplate}
      />
      <form
        className="input_file"
        encType="multipart/formdata"
        onSubmit={handleSubmit(upLoadImage)}
      >
        <InputText
          className="input_file2"
          type="file"
          multiple
          {...register("file")}
        />
        <InputText className="input_file1" type="submit" value="Thêm" />
      </form>
    </div>
  );
};

export default ImageUploader;