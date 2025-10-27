import { Button } from "@mui/material";
import "./ButtonsPanel.css"

function ButtonsPanel() {
  return (
    <div className="table-buttons-panel">
      <Button variant="outlined">Экспорт в Excel</Button>
      <Button variant="outlined">Экспорт в PDF</Button>
      <Button variant="outlined">Построить график</Button>
    </div>
  )
}

export default ButtonsPanel;