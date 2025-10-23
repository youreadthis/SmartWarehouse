import { Paper } from "@mui/material";

function ActivityChart() {
  return (
    <Paper sx={{gridColumn: {md: "span 4", lg: "span 2",  xl: "3"}, gridRow: {xl: "1 / 3"}, padding: "10px"}}>
      <h3 className="acivity-chart-title">График активности роботов за последний час</h3>

    </Paper>
  )
}

export default ActivityChart;