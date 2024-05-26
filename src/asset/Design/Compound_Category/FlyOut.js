import React from "react";
import Icon from "./Icon";

export function FlyOut(props) {
  const [open, toggle1] = React.useState(false);

  return (
    <div className={`flyout`}>
    {React.Children.map(props.children, child =>
      React.cloneElement(child, { open, toggle1 })
    )}
  </div>
  );
}

function Toggle1({ open, toggle1 }) {
  return (
    <div className="flyout-btn" onClick={() => toggle1(!open)}>
      <Icon />
    </div>
  );
}
function List({ children, open }) {
  return open && <ul className="flyout-list">{children}</ul>;
}

function Item({ children, onDelete }) {
  return (
    <li className="flyout-item" onClick={onDelete}>
      {children}
    </li>
  );
}
FlyOut.Toggle1 = Toggle1;
FlyOut.List = List;
FlyOut.Item = Item;