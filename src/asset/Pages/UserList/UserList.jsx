import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AuthContext } from "../../service/user_service.js";
import {
  getuserList,
  createUserList,
  handleDelete,
  handleRole,
  getActive,
} from "../../service/user_data.js";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { CustomDialog } from "../../../components/Total_Interface/index.jsx";
import { ToastContainer } from "react-toastify";
import {
  NotifiUpdate,
  NotifiDelete,
  NotifiCreateRecord,
  NotifiCreate,
} from "../../Design/Observable/index.js";
const emptyProduct = {
  _id: null,
  first_name: "",
  last_name: "",
  email: "",
  role: "",
  password: "",
};
export default function SizeDemo() {
  const { token } = useContext(AuthContext);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedRole, setSelectedRole] = useState(emptyProduct);
  const [productDialog, setProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const userList = await getuserList(token);
      const activeList = await getActive(token);
      setActive(activeList.data.users);
      userList.data.users.forEach((element) => {
        let isActive = false;
        for (const activeUser of activeList.data.users) {
          if (activeUser === element.email) {
            isActive = true;
            break;
          }
        }
        element.address = isActive ? "hoạt động" : "";
      });
      setProducts(userList.data.users);
    };

    fetchData();
  });

  const roles = [{ name: "user" }, { name: "manager" }];

  const roleEditor = () => {
    return (
      <Dropdown
        type="text"
        options={roles}
        optionLabel="name"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.value)}
        className="userUpdateInput"
      />
    );
  };
  const openNew = () => {
    setProductDialog(true);
  };
  const handleChange = (event) => {
    const { value, name } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      const a = {
        first_name: product.first_name,
        last_name: product.last_name,
        email: product.email,
        role: selectedRole.name,
        password: product.password,
      };
      await createUserList(a, token);
      NotifiCreate();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Tạo tài khoản" severity="success" onClick={openNew} />
        <Button
          label="Xóa"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
        <Button
          label="Xem chi tiết"
          severity="success"
          onClick={onRowDoubleClick}
        />
      </div>
    );
  };
  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const deleteSelectedProducts = () => {
    for (const selectedProduct of selectedProducts) {
      handleDeleteUser(selectedProduct);
      setDeleteProductsDialog(false);
    }
  };
  const deleteProduct = () => {
    let _products = products.filter((val) => val._id === product._id);
    const firstObject = _products[0];
    handleDeleteUser(firstObject);
    setDeleteProductDialog(false);
  };
  const navigate = useNavigate();
  const onRowDoubleClick = () => {
    for (const selectedProduct of selectedProducts) {
      navigate(`/user/${selectedProduct._id}`);
    }
  };
  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <i
        className="pi pi-trash"
        onClick={() => confirmDeleteProduct(rowData)}
      ></i>
    );
  };
  const handleDeleteUser = async (product) => {
    try {
      await handleDelete(product._id, token);
      NotifiDelete();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const onRowEditComplete = async () => {
    for (const selectedProduct of selectedProducts) {
      var userId = selectedProduct._id;
    }
    try {
      const response = await handleRole(userId, selectedRole.name, token);
      NotifiUpdate();
      console.log(response);
    } catch (error) {
      console.log("Error update role:", error);
    }
  };
  return (
    <div className="div_main">
      <ToastContainer />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
        <DataTable
          value={products}
          selectionMode={"row"}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          editMode="row"
          dataKey="_id"
          onRowEditComplete={onRowEditComplete}
        >
          <Column selectionMode="multiple" exportable={true}></Column>
          <Column
            sortable
            field="first_name"
            header="Họ"
            value={product.first_name}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="last_name"
            header="Tên"
            value={product.last_name}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            sortable
            field="email"
            header="Email"
            value={product.email}
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="role"
            header="Vai trò"
            value={product.role}
            editor={(options) => roleEditor(options)}
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="address"
            header="Hoạt động"
            style={{ width: "20%" }}
          ></Column>
          <Column
            rowEditor
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ left: "0" }}
          ></Column>
        </DataTable>
        <CustomDialog
          visible={deleteProductsDialog}
          header="Thông báo"
          type="deleteMany"
          onHide={hideDeleteProductsDialog}
          deleteSelectedProducts={deleteSelectedProducts}
          productNameMany={"tài khoản"}
        />
        <CustomDialog
          visible={deleteProductDialog}
          header="Thông báo"
          type="deleteOne"
          onHide={hideDeleteProductDialog}
          deleteProduct={deleteProduct}
          productName={product.first_name + " " + product.last_name}
        />
        <Dialog visible={productDialog} onHide={() => setProductDialog(false)}>
          <h3>Thêm mới</h3>
          <div>
            <form className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Họ</label>
                  <input
                    type="text"
                    name="first_name"
                    value={product.first_name}
                    onChange={handleChange}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Tên</label>
                  <input
                    type="text"
                    name="last_name"
                    value={product.last_name}
                    onChange={handleChange}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    value={product.email}
                    onChange={handleChange}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={product.password}
                    onChange={handleChange}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Vai trò</label>
                  <Dropdown
                    type="text"
                    options={roles}
                    optionLabel="name"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.value)}
                    className="userUpdateInput"
                  />
                </div>
              </div>
            </form>

            <Button
              className="button_Dia"
              label="Hủy"
              outlined
              severity="danger"
              onClick={() => setProductDialog(false)}
            />
            <Button
              className="button_Dia"
              label="Lưu"
              severity="success"
              onClick={handleCreateUser}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
}
