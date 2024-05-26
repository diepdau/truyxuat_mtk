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

function toastify(data) {
  toast.success(data);
}
function logger(data) {
  console.log(`${new Date().toLocaleString()} ${data}`);
}
observable.subscribe(toastify);

observable.subscribe(logger);