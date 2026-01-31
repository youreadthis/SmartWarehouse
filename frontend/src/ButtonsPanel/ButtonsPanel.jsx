import { Button } from "@mui/material";
import "./ButtonsPanel.css"

function ButtonsPanel({ filters, chosenRows }) {
  async function openPDF() {
    const params = new URLSearchParams();

    for (let key in filters) {
      params.append(key, filters[key]);
    }

    const response = await fetch(`/api/pdf?${params}`, {
      method: "POST"
    });
    if (response.ok) {
      const blob = await response.blob();
      
      const pdfUrl = URL.createObjectURL(blob);
      open(pdfUrl);
    }
  }

  async function getExcelFile() {
    const response = await fetch("/api/excel", {
      method: "POST",
      body: JSON.stringify(chosenRows)
    });

    if (response.ok) {
      const blob = await response.blob();
      
      const excelUrl = URL.createObjectURL(blob);
      open(excelUrl);
    } else {
      console.log(response.statusText)
    }
  }

  return (
    <div className="table-buttons-panel">
      <Button variant="outlined" disabled={!chosenRows.length} title={chosenRows.length ? "" : "Сначала выберите записи для экспорта"} onClick={getExcelFile}>Экспорт в Excel</Button>
      <Button variant="outlined" onClick={openPDF}>Экспорт в PDF</Button>
    </div>
  )
}

export default ButtonsPanel;