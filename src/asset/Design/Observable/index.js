import {
  toast
} from "react-toastify";
import observable from "./Observer.jsx";

export function NotifiCreate() {
  observable.notify("Tạo thành công!");
}

export function NotifiUpdate() {
  observable.notify("Sửa thành công!");
}
export function NotifiDelete() {
  observable.notify("Xóa thành công!");
}

export function NotifiCreateRecord() {
  observable.notify("Tạo con trong đàn thành công!");
}

export function NotifiLogin() {
  observable.notify("Đăng nhập thành công!");
}
export function NotifiRegister() {
  observable.notify("Tạo tài khoản thành công!");
}

function toastify(data) {
  toast.success(data);
}
observable.subscribe(toastify);

// function logger(data) {
//   console.log(`${Date.now()} ${data}`);
// }
// observable.subscribe(logger);

// function toastify(data, type) {
//   if (type === "error") {
//     toast.error(data);
//   } else {
//     toast.success(data);
//   }
// }