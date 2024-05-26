import React, {useContext } from "react";
import "./App.css";

import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./asset/Pages/Login/Login.jsx";
import Register from "./asset/Pages/Register/register.jsx";
import Home from "./asset/Pages/Home/Home.jsx";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeflex/primeflex.css"; // css utility
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import Diseases from "./asset/Pages/Diseases/Diseases.jsx";
import FarmingAreas from "./asset/Pages/FarmingAreas/FarmingAreas.jsx";
import Medicine from "./asset/Pages/Medicine/Medicine.jsx";
import "./index.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import CultivationLogs from "./asset/Pages/CultivationLogs/CultivationLogs_Herd.jsx";
import User from "./asset/Pages/User/User.jsx";
import UserList from "./asset/Pages/UserList/UserList.jsx";
import Categories from "./asset/Pages/Categories/Categories.jsx";
import Harvest from "./asset/Pages/Harvest/Harvest.jsx"
import Harvest_Update from "./asset/Pages/Harvest/Harvest_Update.jsx"
import { AuthContext } from "./asset/service/user_service.js";
import Herds_Details_List from "./asset/Pages/Home/Herds_Details_List.jsx";
import ProductPatch from "./asset/Pages/ProductPatchs/ProductPatchs.jsx";
import ProcessorsProducts  from "./asset/Pages/ProductPatchs/Processors_Product.jsx";
import Treatments  from "./asset/Pages/Treatments/Treatments.jsx";
import Main from "./components/Sidebar/Main.jsx";
import ForgotPasswordPage from "./asset/Pages/Login/ForgotPassword.jsx";
import ProductInfos from "./asset/Pages/Product_Infos/Product_Infos.jsx";
export const themes = {
  light: {
    background: "#fff",
    color: "#000"
  },
  dark: {
    background: "#171717",
    color: "#fff"
  }
};

export const ThemeContext = React.createContext();
function App() {
const Layout = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div  >
     {currentUser && (
      <>
      <nav className="navbar">
        <Navbar />
      </nav>

          <Main/>
      </>
      
      )}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
    // element: <ForgotPasswordPage  />,

  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage  />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/danh-sach-dan",
        element: <Home />,
      },
      {
        path: "/trang-trai",
        element: <FarmingAreas />,
      },
      {
        path: "/nhat-ki-cham-soc",
        element: <CultivationLogs />,
      },
      {
        path: "/benh",
        element: <Diseases />,
      },
      {
        path: "/thuoc-thu-y",
        element: <Medicine />,
      },
      {
        path: "/user/:id",
        element: <User />,
      },
      {
        path: "/userList",
        element: <UserList />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/herds/:id",
        element: <Herds_Details_List />,
      }, 
      {
        path: "/thu-hoach",
        element: <Harvest />,
      }, 
      {
        path: "/harvests/:id",
        element: <Harvest_Update />,
      }, 
     
      {
        path: "/lo-san-pham",
        element: <ProductPatch />,
      },
      {
        path: "/processors/products",
        element: <ProcessorsProducts  />,
      },
      {
        path: "/dieu-tri",
        element: <Treatments  />,
      },
      {
        path: "/thong-tin",
        element: <ProductInfos  />,
      },
      
     
    ],
  },
  
  
]);

  return (
    <div>
      <RouterProvider router={router} />  
    </div>
  );
}

export default App;
