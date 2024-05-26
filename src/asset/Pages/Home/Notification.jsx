import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../service/user_service.js";
import { fetchNotifications } from "../../service/Herd_data.js";
import "react-toastify/dist/ReactToastify.css";
import Observer from "../../Design/Observable/Observer.jsx";


const NotificationBox = () => {
  const { token } = useContext(AuthContext);
  const [triggerFetch, setTriggerFetch] = useState(false); // Sử dụng state để ghi nhận sự thay đổi

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNotifications(token);
        console.log(response);
        const firstThreeNotifications = response.slice(0, 2);

        firstThreeNotifications.forEach((notification) => {
          const herdNameMatch = notification.message.match(
            /Herd (\w+) has reached the harvest age\./
          );
          if (herdNameMatch) {
            const herdName = herdNameMatch[1];
            Observer.notify(`Đàn ${herdName} đã đến tuổi thu hoạch`);
          }
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setTriggerFetch((prev) => !prev);
    }, 60000);

    return () => clearInterval(interval);
  }, [token, triggerFetch]);

  return null;
};

export default NotificationBox;
