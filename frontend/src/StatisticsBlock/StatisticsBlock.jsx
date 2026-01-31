import { Paper } from "@mui/material";
import "./StatisticsBlock.css"
import { useEffect, useState } from "react";

function StatisticsBlock({ filters }) {
  const [isFetched, setIsFetched] = useState(false);
  const [scans, setScans] = useState(0);

  useEffect(
    () => setIsFetched(false),
    [filters]
  );

  const dateFrom = filters.dateFrom || "1970-01-01";
  let dateTo = filters.dateTo || new Date().toISOString();

  if (dateTo.includes("T")) {
    dateTo = dateTo.slice(0, dateTo.indexOf("T"));
  }

  const params = new URLSearchParams();
  params.append("dateFrom", dateFrom);
  params.append("dateTo", dateTo);

  if (!isFetched) {
    const response = fetch(`/api/statistics?${params}`);

    response.then(res => {
      const json = res.json();
      json.then(result => {
        if (result.scans !== undefined) {
          setScans(result.scans);
        }
      })
    })
  }

  return (
    <Paper sx={{ padding: "25px" }}>
      <h2 className="stats-title">Сводная статистика</h2>
      <div className="stats-line">
        <span>Всего проверок за период: {scans}</span>
      </div>
    </Paper>
  )
}

export default StatisticsBlock;