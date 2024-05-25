import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import "./Harvest.css";
export default function BasicDemo() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://agriculture-traceability.vercel.app/api/v1/harvests?limit=100");
        const harvests = response.data.harvests;

        // Tính tổng số lượng sản phẩm theo tên
        const productTotals = {};
        harvests.forEach((harvest) => {
          const productName = harvest.name;
          const quantity = harvest.quantity;
          if (productTotals[productName]) {
            productTotals[productName] += quantity;
          } else {
            productTotals[productName] = quantity;
          }
        });

        // Tạo mảng chứa các nhãn (labels) và dữ liệu (data) cho biểu đồ theo tên sản phẩm
        const labels = Object.keys(productTotals);
        const data = Object.values(productTotals);

        // Định dạng dữ liệu cho biểu đồ
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Số lượng", // Nhãn cho dữ liệu
              data: data, // Dữ liệu số lượng
              backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền cho cột
              borderColor: "rgba(75, 192, 192, 1)", // Màu viền cho cột
              borderWidth: 1, // Độ rộng viền cho cột
            },
          ],
        };

        // Định dạng tùy chọn cho biểu đồ
        const chartOptions = {
          scales: {
            y: {
              beginAtZero: true, // Bắt đầu từ 0 trên trục y
            },
          },
        };

        // Cập nhật trạng thái của biểu đồ và tùy chọn
        setChartData(chartData);
        setChartOptions(chartOptions);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    // Gọi hàm fetchData để lấy dữ liệu từ server khi component được render
    fetchData();
  }, []);

  return (
    <div>
      <div className="card">
        <h5>Biểu đồ tổng số lượng sản phẩm</h5>
        <div className="card chart-container">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
