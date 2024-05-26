import {menu} from "./data.ts";
import {menuUser} from "./dataUser.ts";

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'primeicons/primeicons.css';
import "./Sidebar.css";
import { AuthContext } from "../../asset/service/user_service.js";



const SidebarItem = ({ item, selectedItem, handleItemClick }) => {
  return (
    <Link className="menu-link" key={item.id} to={item.url}>
      <li
        className={selectedItem === item ? 'selected item' : 'item'}
        onClick={() => handleItemClick(item)}
      >
        <i id="icon"className={item.icon}></i>
        <span className="title">{item.label}</span>
      </li>
    </Link>
  );
};

function Sidebar() {
  const { currentUser } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const menuData = currentUser.role === "admin" ? menu : menuUser; 

  return (
    <div>
      <nav className="sidebar">
        <div className="menu-items">
          {menuData.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              selectedItem={selectedItem}
              handleItemClick={handleItemClick}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;


