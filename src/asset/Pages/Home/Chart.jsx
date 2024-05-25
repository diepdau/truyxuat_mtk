import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import "./Home.css";

const FarmProduct = ({ reloadData }) => {
  const [herds, setHerds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHerds = async () => {
      try {
        const response = await axios.get("https://agriculture-traceability.vercel.app/api/v1/herds?limit=50");
        setHerds(response.data.herds);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching herds:", error);
      }
    };

    fetchHerds();
  }, []);

  useEffect(() => {
    if (!loading && herds) {
      const data = {
        labels: herds.map((herd) => herd.name),
        datasets: [
          {
            data: herds.map((herd) => herd.member_count),
            backgroundColor: ["#5092de", "#dbc267", "#63c078", "#c07e52"], // Example colors
            hoverBackgroundColor: ["#5092de", "#dbc267", "#63c078", "#c07e52"], // Example colors
          },
        ],
      };
      setChartData(data);
    }
  }, [herds, loading]);

  const [chartData, setChartData] = useState({});

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
  };
  return (
    <div>
      <div className="card flex justify-content-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h5>Biểu đồ số lượng</h5>
            <div className="chart-container">
              <Chart
                type="pie"
                data={chartData}
                options={chartOptions}
                className="w-50% md:w-20rem"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FarmProduct;
