import React from "react";
import FlyOutMenu from "./FlyOutMenu";
const sources =  [
  
    {
        path: "https://res.cloudinary.com/dzo0r5bea/image/upload/v1715523406/agriculture_traceability/wtfjaopfscyrvirsc8vw.jpg",
        filename: "agriculture_traceability/wtfjaopfscyrvirsc8vw",
        _id: "6640cf4e96c02101c5b57c5f"
    },
    {
        path: "https://res.cloudinary.com/dzo0r5bea/image/upload/v1715523406/agriculture_traceability/tktswm8ig59oit8ujmpq.jpg",
        filename: "agriculture_traceability/tktswm8ig59oit8ujmpq",
        _id: "6640cf4e96c02101c5b57c60"
    },
    {
        path: "https://res.cloudinary.com/dzo0r5bea/image/upload/v1715523406/agriculture_traceability/evlbekjhgpuewshuhof9.jpg",
        filename: "agriculture_traceability/evlbekjhgpuewshuhof9",
        _id: "6640cf4e96c02101c5b57c61"
    }
  ]

function Image({ source }) {
  return (
      <div className="image-item">
      <img className="imgactive" src={source.path} alt="Squirrel" />
      <FlyOutMenu />
      </div>
   
  );
}

export default function ImageList() {
  return sources.map((source, i) => <Image source={source} key={i} />);
};
