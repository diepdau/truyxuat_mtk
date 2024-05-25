
import React from "react";
import "../../Pages/Categories/Categories.css";
import { FlyOut } from "./FlyOut.js";

export default function FlyoutMenu() {
  return (
    <FlyOut>
      <FlyOut.Toggle />
      <FlyOut.List>
        <FlyOut.Item>Delete</FlyOut.Item>
      </FlyOut.List>
    </FlyOut>
  );
}

