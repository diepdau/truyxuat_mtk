import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./User.css";
import imgAdmin from "../../Img/Desktop/adminName.png";
import { Button } from "primereact/button";
import {
  updateUserInfo,
  getUser,
  changeUserPassword,
  getUserAdmin,
} from "../../service/user_data.js";
import { AuthContext } from "../../service/user_service.js";
import { Dialog } from "primereact/dialog";
import { ToastContainer } from "react-toastify";
import { NotifiUpdate} from "../../Design/Observable/index.js";
const initFormValue = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  role: "",
  oldPassword: "",
  newPassword: "",
};
export default function User() {
  const { currentUser, token } = useContext(AuthContext);
  const [user, setuser] = useState([]);
  const [passwordDialog, setpasswordDialog] = useState(false);
  const [formValue, setFormValue] = useState(initFormValue);
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (userId && userId === "my-profile") {
          const res = await getUserAdmin(token);
          setuser(res.data.user);
        } else {
          const res = await getUser(userId, token);
          setuser(res.data.user);
        }
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);
  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUserInfo(
        {
          first_name: formValue.first_name || user.first_name,
          last_name: formValue.last_name || user.last_name,
          email: formValue.email || user.email,
          phone: formValue.phone || user.phone,
          address: formValue.address || user.address,
          role: formValue.role || user.role,
        },
        token
      );
      NotifiUpdate();
      navigator("/user");
    } catch (error) {
      console.log("Lỗi chỉnh sửa:", error.mgs);
    }
  };
  const handleChangePassword = async (event) => {
    event.preventDefault();
    try {
      await changeUserPassword(
        {
          oldPassword: formValue.oldPassword,
          newPassword: formValue.newPassword,
        },
        token
      );
    } catch (error) {
      console.log("Lỗi chỉnh sửa:", error.msg);
    }
  };
  const changePassword = () => {
    setpasswordDialog(true);
  };
  return (
    <div className="user div_main">
    
      {user && Object.keys(user).length > 0 && (
        <>
          <div className="userTitleContainer">
          < ToastContainer/>
            <h2 className="userTitle">Tài khoản</h2>

            <Button
              disabled={currentUser.role === "admin" && userId.length > 10}
              label="Đổi mật khẩu"
              severity="success"
              onClick={changePassword}
            />
          </div>

          <div className="userContainer ">
            <div className="userContainer1">
              <div className="userShowTop card">
                <img src={imgAdmin} alt="" className="userShowImg" />
                <div className="userShowTopTitle">
                  <span className="userShowUsername">
                   {currentUser.name}
                  </span>
                  <span className="userShowUserTitle">{user.role}</span>
                </div>
              </div>

              <div className="userShowBottom card">
                <span className="userShowTitle">Thông tin tài khoản</span>
                <div className="userUpdateItem">
                  <label>Tên</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    value={currentUser.name }
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    value={user.email}
                  />
                </div>
                {/* <div className="userUpdateItem">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    className="userUpdateInput"
                    value={user.password}
                  />
                </div> */}
              </div>
            </div>
            <div className="userUpdate card">
              <span className="userUpdateTitle">Chỉnh sửa</span>
              <form className="userUpdateForm" onSubmit={handleSubmit}>
                <div className="userUpdateLeft">
                  <div className="userUpdateItem">
                    <label>Họ</label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder={user.first_name}
                      className="userUpdateInput"
                      value={formValue.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Tên</label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder={user.last_name}
                      className="userUpdateInput"
                      value={formValue.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      placeholder={user.email}
                      className="userUpdateInput"
                      value={formValue.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Số điện thoại</label>
                    <input
                      name="phone"
                      type="text"
                      placeholder={user.phone}
                      className="userUpdateInput"
                      value={formValue.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      placeholder={user.address}
                      className="userUpdateInput"
                      value={formValue.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Vai trò</label>
                    <input
                      type="text"
                      name="role"
                      placeholder={user.role}
                      className="userUpdateInput"
                      value={formValue.role}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="userUpdateRight">
                  <div className="userUpdateUpload">
                    <img
                      className="userUpdateImg"
                      src="https://cdn.pixabay.com/photo/2017/04/12/16/23/morgentau-2224943_1280.jpg"
                      alt=""
                    />
                    <label htmlFor="file">
                      {/* <Publish className="userUpdateIcon" /> */}
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} />
                  </div>
                  <Button
                    disabled={
                      currentUser.role === "admin" && userId.length > 10
                    }
                    type="submit"
                    className="userUpdateButton"
                    label="Chỉnh sửa"
                    severity="success"
                    raised
                  />
                </div>
              </form>
            </div>
          </div>
          <Dialog
            visible={passwordDialog}
            onHide={() => setpasswordDialog(false)}
            header="Đổi mật khẩu"
          >
            <div>
              <form className="userUpdateForm">
                <div className="userUpdateLeft">
                  <div className="userUpdateItem">
                    <div className="userUpdateItem">
                      <label>Mật khẩu cũ </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={formValue.oldPassword}
                        onChange={handleChange}
                        className="userUpdateInput"
                      />
                    </div>
                    <div className="userUpdateItem">
                      <label>Mật khẩu mới</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formValue.newPassword}
                        onChange={handleChange}
                        className="userUpdateInput"
                      />
                    </div>
                  </div>
                </div>
              </form>

              <Button
                className="btn_top"
                label="Lưu"
                severity="success"
                onClick={handleChangePassword}
              />
              <Button
                className="btn_top"
                label="Hủy"
                severity="danger"
                onClick={() => setpasswordDialog(false)}
              />
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
}
