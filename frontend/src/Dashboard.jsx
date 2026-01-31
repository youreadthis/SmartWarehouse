import Header from "./Header/Header"
import HorizontalMenu from "./HorizontalMenu/HorizontalMenu"
import WarehouseMap from "./WarehouseMap/WarehouseMap";
import StatisticsCard from "./StatisticsCard/StatisticsCard";
import ActivityChart from "./ActivityChart/ActivityChart";
import LatestScansTable from "./LatestScansTable/LatestScansTable";
import { Grid, Typography } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Battery4BarIcon from '@mui/icons-material/Battery4Bar';
import { useState } from "react";


function Dashboard() {
  if (!localStorage.getItem("token")) {
    location.href = "/login";
  }
  document.title = "Текущая статистика";

  const [stats, setStats] = useState({
    active: NaN,
    total: NaN,
    checksToday: NaN,
    runningOut: NaN,
    averageBatteryLevel: NaN
  });

  const [robotsData, setRobotsData] = useState(null);
  const [zonesStatuses, setZonesStatuses] = useState(null);
  const [latestScans, setLatestScans] = useState([]);
  const [isAutoUpdated, setIsAutoUpdated] = useState(true);

  const [websocketState, setWebsocketState] = useState("connecting");

  if (websocketState !== "active") {
    const statsSocket = new WebSocket(`/ws`);
    statsSocket.onopen = () => setWebsocketState("active");
    statsSocket.onerror = () => setWebsocketState("error");
    statsSocket.onclose = () => setWebsocketState("error");
    statsSocket.onmessage = event => {
      let statsFromServer = JSON.parse(event.data);
      if (typeof statsFromServer === "string") {
        statsFromServer = JSON.parse(statsFromServer);
      }
      setStats({
        active: statsFromServer["statuses"]["active"],
        total: statsFromServer["statuses"]["total"],
        checksToday: statsFromServer["checks_today"],
        runningOut: statsFromServer["running_out"],
        averageBatteryLevel: statsFromServer["average_battery_level"]
      });

      setRobotsData(statsFromServer["robots_data_for_map"]);
      setZonesStatuses(statsFromServer["zones_statuses"]);
      if (isAutoUpdated) setLatestScans(statsFromServer["latest_scans"]);
    };
  }

  return (
    <>
      <Header />
      <HorizontalMenu />
      <Grid container alignItems={"start"} sx={{ display: { lg: "grid" }, gridTemplateColumns: { lg: "auto 1fr" }, justifyItems: "start", alignContent: "start", rowGap: "10px" }}>
        <Grid sx={{ gridRow: { lg: "span 4" } }}>
          <WarehouseMap zonesStatuses={zonesStatuses} robotsData={robotsData} />
        </Grid>
        <Grid container gap={"10px"} sx={{
          display: { md: "grid" }, gridTemplateColumns: {
            md: "repeat(4, auto)",
            lg: "repeat(3, auto)"
          }, marginTop: { lg: "25px" }, padding: "24px"
        }}>
          <StatisticsCard title="Активных роботов" icon={<SmartToyIcon sx={{ verticalAlign: "middle" }} />}>
            <Typography sx={{ gridColumn: 2 }}>{isFinite(stats.active) ? stats.active : ""}{isFinite(stats.total) ? `/${stats.total}` : websocketState === "active" ? "Загрузка..." : "Нет данных"}</Typography>
          </StatisticsCard>
          <StatisticsCard title="Проверено сегодня" icon={<CheckCircleIcon color="success" sx={{ verticalAlign: "middle" }} />}>
            <Typography sx={{ gridColumn: 2 }}>{isFinite(stats.checksToday) ? stats.checksToday : websocketState === "active" ? "Загрузка..." : "Нет данных"}</Typography>
          </StatisticsCard>
          <StatisticsCard title="Критических остатков" icon={<ErrorOutlineIcon color="error" sx={{ verticalAlign: "middle" }} />}>
            <Typography sx={{ gridColumn: 2 }}>{isFinite(stats.runningOut) ? stats.runningOut : websocketState === "active" ? "Загрузка..." : "Нет данных"}</Typography>
          </StatisticsCard>
          <StatisticsCard title="Средний заряд батарей" icon={<Battery4BarIcon sx={{ verticalAlign: "middle" }} />}>
            <Typography sx={{ gridColumn: 2 }}>{isFinite(stats.averageBatteryLevel) ? `${stats.averageBatteryLevel}%` : websocketState === "active" ? "Загрузка..." : "Нет данных"}</Typography>
          </StatisticsCard>
          <ActivityChart></ActivityChart>
        </Grid>
        <Grid sx={{ gridColumn: { lg: "2" }, display: "flex", flexDirection: "column", gap: "20px", gridRow: { lg: "2 / 3" } }}>
          <LatestScansTable scans={latestScans} isAutoUpdated={isAutoUpdated} setIsAutoUpdated={setIsAutoUpdated} />
        </Grid>
      </Grid>
      <div className={`ws-indicator ws-indicator-${websocketState}`} title={`WebSocket-соединение ${websocketState === "active" ? "активно" : websocketState === "error" ? "потеряно" : "устанавливается"}`}>
        <Typography sx={visuallyHidden}>{`WebSocket-соединение ${websocketState === "active" ? "активно" : websocketState === "error" ? "потеряно" : "устанавливается"}`}</Typography>
      </div>
    </>
  )
}

export default Dashboard;
