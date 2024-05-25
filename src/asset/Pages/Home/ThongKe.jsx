import React from "react";
import { calculateAgeInMonths } from "../../../components/Date/DateBirth.jsx";
import { DateChecker } from "../../../components/Date/DateChecker.jsx";

const YourComponent = ({ data, reloadData, dataHarvest, dataTreatment }) => {
  function countSubarrays(array) {
    return array.length;
  }
  return (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Tên đàn</span>
              <div className="text-900 font-medium text-xl">{data.name}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-info-circle text-blue-500 text-xl"></i>
            </div>
          </div>
          <span className="text-green-500 font-medium">
            {calculateAgeInMonths(data.start_date)}
          </span>
          <span className="text-500"> tháng tuổi</span>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Số lượng </span>
              <div className="text-900 font-medium text-xl">
                {data.member_count} con
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-cloud text-orange-500 text-xl"></i>
            </div>
          </div>
          <span className="text-green-500 font-medium">
            {countSubarrays(dataHarvest) === 0
              ? ""
              : countSubarrays(dataHarvest)}
          </span>
          <span className="text-500">
            {countSubarrays(dataHarvest) !== 0
              ? " lần thu hoạch "
              : "Chưa thu hoạch"}
          </span>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Trạng thái
              </span>
              <div className="text-900 font-medium text-xl">{data.status}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-inbox text-cyan-500 text-xl"></i>
            </div>
          </div>
          <span className="text-green-500 font-medium">
            {DateChecker(data.start_date)}
          </span>
          <span className="text-500"> dự kiến ngày kết thúc</span>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Điều trị</span>
              <div className="text-900 font-medium text-xl">{}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl"></i>
            </div>
          </div>
          <span className="text-green-500 font-medium">
            {countSubarrays(dataTreatment) === 0
              ? " "
              : countSubarrays(dataTreatment)}
          </span>
          <span className="text-500">
            {DateChecker(data.start_date) !== 0
              ? " lần điều trị"
              : "Chưa điều trị"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
