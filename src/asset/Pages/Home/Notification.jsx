import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../service/user_service.js";
import { fetchNotifications } from "../../service/Herd_data.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationBox = () => {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNotifications(token);
        console.log(response);

        // Lấy 3 thông báo đầu tiên
        const firstThreeNotifications = response.slice(0, 3);

        firstThreeNotifications.forEach((notification) => {
          const herdNameMatch = notification.message.match(
            /Herd (\w+) has reached the harvest age\./
          );
          if (herdNameMatch) {
            const herdName = herdNameMatch[1];
            toast.success(`Đàn ${herdName} đã đến tuổi thu hoạch`);
          }
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={10000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default NotificationBox;
