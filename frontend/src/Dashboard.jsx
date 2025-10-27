import Header from "./Header/Header"
import HorizontalMenu from "./HorizontalMenu/HorizontalMenu"
import WarehouseMap from "./WarehouseMap/WarehouseMap";
import StatisticsCard from "./StatisticsCard/StatisticsCard";
import ActivityChart from "./ActivityChart/ActivityChart";
import LatestScansTable from "./LatestScansTable/LatestScansTable";
import AIPrediction from "./AIPrediction/AIPrediction"
import { Grid, Typography } from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Battery4BarIcon from '@mui/icons-material/Battery4Bar';


function Dashboard() {
  document.title = "Текущая статистика";

  return (
    <>
      <Header />
      <HorizontalMenu />
      <Grid container alignItems={"start"} sx={{ display: { lg: "grid" }, gridTemplateColumns: { lg: "auto 1fr" }, justifyItems: "start", alignContent: "start", rowGap: "10px" }}>
        <Grid sx={{ gridRow: { lg: "span 4" } }}>
          <WarehouseMap />
        </Grid>
        <Grid container gap={"10px"} sx={{
          display: { md: "grid" }, gridTemplateColumns: {
            md: "repeat(4, auto)",
            lg: "repeat(3, auto)"
          }, marginTop: {lg: "25px"}, padding: "24px"
        }}>
          <StatisticsCard title="Активных роботов" icon={<SmartToyIcon sx={{ verticalAlign: "middle" }} />}>
            <Typography fontSize={"1.75rem"} sx={{ gridColumn: 2 }}>0/0</Typography>
          </StatisticsCard>
          <StatisticsCard title="Проверено сегодня" icon={<CheckCircleIcon color="success" sx={{ verticalAlign: "middle" }} />}>
            <Typography fontSize={"1.75rem"} sx={{ gridColumn: 2 }}>0</Typography>
          </StatisticsCard>
          <StatisticsCard title="Критических остатков" icon={<ErrorOutlineIcon color="error" sx={{ verticalAlign: "middle" }} />}>
            <Typography fontSize={"1.75rem"} sx={{ gridColumn: 2 }}>0</Typography>
          </StatisticsCard>
          <StatisticsCard title="Средний заряд батарей" icon={<Battery4BarIcon sx={{ verticalAlign: "middle" }} />}>
            <Typography fontSize={"1.75rem"} sx={{ gridColumn: 2 }}>100%</Typography>
          </StatisticsCard>
          <ActivityChart></ActivityChart>
        </Grid>
        <Grid sx={{ gridColumn: { lg: "2" }, display: "flex", gap: "20px", gridRow: { lg: "2" } }}>
          <LatestScansTable />
        </Grid>
        <Grid sx={{ gridColumn: { lg: "2" }, display: "flex", gap: "20px", gridRow: { lg: "3" } }}>
          <AIPrediction />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard;
