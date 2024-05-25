import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Image from "./Image.jsx";
import { BrowserRouter } from "react-router-dom";

test("should render a list of images", () => {
    const images= [
        {
            "path": "https://res.cloudinary.com/dzo0r5bea/image/upload/v1713120102/agriculture_traceability/kt6czbd8ji1ar2ldiopa.jpg",
            "filename": "agriculture_traceability/kt6czbd8ji1ar2ldiopa",
            "_id": "661c2366dd38a68ef9ea3f50"
        },
        {
            "path": "https://res.cloudinary.com/dzo0r5bea/image/upload/v1713120102/agriculture_traceability/dqwmfxaf7rfzjx8bhzg0.jpg",
            "filename": "agriculture_traceability/dqwmfxaf7rfzjx8bhzg0",
            "_id": "661c2366dd38a68ef9ea3f51"
        }
    ];
    render(
      <BrowserRouter>
        <Image images={images} />
      </BrowserRouter>
    );
    const imageVisible = screen.getAllByRole('img');
    expect(imageVisible).toHaveLength(1);
    const liVisible = screen.getAllByRole('listitem');
    expect(liVisible).toHaveLength(2);
   
  });