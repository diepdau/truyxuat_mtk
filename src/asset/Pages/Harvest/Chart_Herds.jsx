import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import axios from "axios";
import "./Harvest.css"
export default function StackedBarDemo() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://agriculture-traceability.vercel.app/api/v1/harvests?limit=200");
        const harvests = response.data.harvests;

        const datasets = {};
        // Lặp qua mỗi mục trong mảng harvests và tính tổng số lượng sản phẩm của mỗi loại trong mỗi đàn cừu
        harvests.forEach((harvest) => {
          const herdName = harvest.herd.name;
          const productName = harvest.name;
          const quantity = harvest.quantity;

          // Kiểm tra xem dataset cho đàn cừu đã tồn tại hay chưa
          if (!datasets[herdName]) {
            datasets[herdName] = {};
          }

          // Tăng số lượng sản phẩm của loại đó trong đàn cừu lên
          if (!datasets[herdName][productName]) {
            datasets[herdName][productName] = quantity;
          } else {
            datasets[herdName][productName] += quantity;
          }
        });

        // Tạo mảng chứa các nhãn (labels) và dữ liệu (data) cho biểu đồ

        const labels = Object.keys(datasets);

        const data = Object.values(datasets).map((products) =>
          Object.values(products)
        );

        // Định dạng dữ liệu cho biểu đồ
        const chartData = {
          labels: labels,
          datasets: data.map((products, index) => ({
            label: labels[index],
            data: products,
            backgroundColor: getRandomColor(), // Màu ngẫu nhiên cho mỗi đàn cừu
          })),
        };

        // Định dạng tùy chọn cho biểu đồ
        const chartOptions = {
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
        };

        // Cập nhật trạng thái của biểu đồ và tùy chọn
        setChartData(chartData);
        console.log(chartData);
        setChartOptions(chartOptions);
        console.log(chartOptions);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    // Gọi hàm fetchData để lấy dữ liệu từ server khi component được render
    fetchData();
  }, []);

  // Hàm để tạo màu ngẫu nhiên
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="card">
      <h5>Biểu đồ cột của một đàn</h5>
      <div className="card chart-container">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
