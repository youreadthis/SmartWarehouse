import { Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useState } from "react";

let minutesArr = []
for (let i = 0; i < 60; i++) {
  minutesArr.push(i);
}

function ActivityChart() {
  const [scansData, setScansData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  if (!isFetched) {
    const response = fetch("/api/activity")
    response.then(res => {
      const json = res.json()
      json.then(data => {
        setScansData(data);
        setIsFetched(true);
      })
    }, err => {
      console.log(err);
      setIsFetched(true);
    });

    setTimeout(() => setIsFetched(false), 1800 * 1000) // График обновляется каждые полчаса
  }

  return (
    <Paper sx={{ gridColumn: { md: "span 4" }, gridRow: { xl: "1 / 3" }, padding: "10px", maxWidth: "100vw", overflow: "auto" }}>
      <h3 className="acivity-chart-title">График активности роботов за последний час</h3>
      <Typography color="#3B3B3B">Обновление каждые 30 минут</Typography>
      <LineChart
        height={700}
        xAxis={[{ data: minutesArr, scaleType: "point", label: "Минут назад" }]}
        series={scansData.map((item, index) => { return { data: item, label: `Робот ${index + 1}` } })}
        yAxis={[{ tickMinStep: 1, label: "Проверок" }]}
        localeText={{
          loading: "Загрузка данных...",
          noData: "Нет данных"
        }}
      >
      </LineChart>
    </Paper >
  )
}

export default ActivityChart;