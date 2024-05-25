// import React,{useContext,useState} from 'react';
import {menu} from "./data.ts";
import {menuUser} from "./dataUser.ts";
// import { Link } from "react-router-dom";
// import 'primeicons/primeicons.css';
// import "./Sidebar.css";
// import { AuthContext } from "../../asset/service/user_service.js";

// function Sidebar0() {
//   const { currentUser } = useContext(AuthContext);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//   };

//   return (
//     <div>
//       <nav className="sidebar">
//         <div className="menu-items">
//           {currentUser.role === "admin" ? (
//             menu.map((item) => (
//               <Link className="menu-link" key={item.id} to={item.url}>
//                 <li
//                   className={selectedItem === item ? 'selected item' : 'item'}
//                   onClick={() => handleItemClick(item)}
//                 >
//                   <i id="icon"className={item.icon}></i>
//                   <span className="title">{item.label}</span>
//                 </li>
//               </Link>
//             ))
//           ) : (
//             menuUser.map((item) => (
//               <Link className="menu-link" key={item.id} to={item.url}>
//                 <li
//                   className={selectedItem === item ? 'selected item' : 'item'}
//                   onClick={() => handleItemClick(item)}
//                 >
//                   <i id="icon" className={item.icon}></i>
//                   <span className="title">{item.label}</span>
//                 </li>
//               </Link>
//             ))
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default Sidebar0;

// Bridge Pattern
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'primeicons/primeicons.css';
import "./Sidebar.css";
import { AuthContext } from "../../asset/service/user_service.js";

// Component interface
const ButtonUI = ({
  theme,
  ...props
}) => {
  return (
    <button
      {...props}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.color,
      }}
    />
  )
}

// Abstraction interface
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

// Client
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


