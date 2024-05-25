import React, { useEffect, useState, useContext } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { useLocation } from "react-router-dom";
import Infor_Herd from "./Infor_Herd.jsx";
import RecordsList from "./RecordsList.jsx";
import CultivationLogs_Herd from "../CultivationLogs/CultivationLogs_Herd.jsx";
import Treatments from "../Treatments/Treatments.jsx";
import "./HerdsList.css";
import Harvest from "../Harvest/Harvest.jsx";
import YourComponent from "./ThongKe.jsx";
import { handleGetHerdHarvest1 } from "../../service/harvest_data.js";
import { handleGetHerdTreatment } from "../../service/treatment_data.js";
import { AuthContext } from "../../service/user_service.js";
import { fetchHerd } from "../../service/Herd_data.js";
export default function BasicDemo() {
  const [formData, setFormData] = useState({});
  const [formDataHarvest, setFormDataHarvest] = useState({});
  const [formDataTreatment, setFormDataTreatment] = useState({});
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const herdId = location.pathname.split("/")[2];

  const getAllData = async () => {
    setFormData(await fetchHerd(herdId, token));
    setFormDataHarvest(await handleGetHerdHarvest1(herdId, token));
    setFormDataTreatment(await handleGetHerdTreatment(herdId, token));
  };

  useEffect(() => {
    getAllData();
  }, [formData, formDataHarvest, formDataTreatment]);
  const reloadData123 = () => {
    getAllData();
  };
  return (
    <div className="div_main herdList">
      <YourComponent
        data={formData}
        reloadData={reloadData123}
        dataHarvest={formDataHarvest}
        dataTreatment={formDataTreatment}
      />
      <div className="card card_herd">
        <TabView>
          <TabPanel header="Thông tin">
            {/* eslint-disable-next-line react/jsx-pascal-case */}
            <Infor_Herd
              herdId={herdId}
              data={formData}
              reloadData={reloadData123}
              isUpdate={true}
            />
          </TabPanel>
          <TabPanel header="Danh sách con">
            <RecordsList herdId={herdId} />
          </TabPanel>
          <TabPanel header="Nhật kí chăm sóc">
            <CultivationLogs_Herd idherd={herdId} />
          </TabPanel>
          <TabPanel header="Thu hoạch">
            <Harvest isherdharvest={herdId} />
          </TabPanel>
          <TabPanel header="Điều trị">
            <Treatments idherd={herdId} herdname={formData.name} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}
