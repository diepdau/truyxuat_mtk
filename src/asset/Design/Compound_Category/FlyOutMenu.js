
import React from "react";
import "../../Pages/Categories/Categories.css";
import { FlyOut } from "./FlyOut.js";

export default function FlyoutMenu({ onDelete }) {
  return (
    <FlyOut>
      <FlyOut.Toggle />
      <FlyOut.List>
        <FlyOut.Item  onDelete={onDelete} >Delete</FlyOut.Item>
      </FlyOut.List>
    </FlyOut>
  );
}

