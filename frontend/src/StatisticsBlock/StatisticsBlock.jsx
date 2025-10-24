import { Paper } from "@mui/material";
import "./StatisticsBlock.css"

function StatisticsBlock() {
  return (
    <Paper sx={{padding: "25px"}}>
      <h2 className="stats-title">Сводная статистика</h2>
      <div className="stats-line">
        <span>Всего проверок за период: 0</span>
        <span>Уникальных товаров: 0</span>
        <span>Выявлено расхождений: 0</span>
        <span>Среднее время инвентаризации, мин: 0</span>
      </div>
    </Paper>
  )
}

export default StatisticsBlock;