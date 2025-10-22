import { Paper } from "@mui/material"
import "./StatisticsCard.css"

function StatisticsCard({ title, icon, children }) {
  return (
    <Paper sx={{padding: "10px", minHeight: "200px", display: "grid", gridTemplateColumns: "repeat(2, auto)", columnGap: "15px", rowGap: "5px", alignContent: "start"}}>
      {icon ? icon : ""} 
      <h3 className="statistics-card-title">{title}</h3>
      {children}
    </Paper>
  )
}

export default StatisticsCard