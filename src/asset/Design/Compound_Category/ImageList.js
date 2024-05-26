import React,{useState} from "react";
import FlyOutMenu from "./FlyOutMenu";

function Image({ source, onDelete }) {
  return (
    <div className="image-item">
      <img className="imgactive" src={source.path} alt="Squirrel" />
      <FlyOutMenu onDelete={onDelete}/>
    </div>
  );
}


export default function ImageList({ source }) {
  const [images, setImages] = useState(source);

  const handleDelete = (id) => {
    const updatedImages = images.filter(image => image._id !== id);
    console.log(images);
    setImages(updatedImages);
  };

  return images.map((item, index) => (
    <Image source={item} key={index} onDelete={() => handleDelete(item._id)} />
  ));
}