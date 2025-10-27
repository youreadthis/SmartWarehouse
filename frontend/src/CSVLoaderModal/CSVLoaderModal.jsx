import { Dialog, DialogContent, DialogActions, DialogTitle, LinearProgress, Typography, Button } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useState } from "react";
import "./CSVLoaderModal.css"

function CSVLoaderModal({ open, handleClose }) {
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [progress, setProgress] = useState(0);


  if (progress < 100) {
    setTimeout(() => setProgress(progress + 10), 500)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Загрузка данных инвентаризации</DialogTitle>
      <DialogContent>
        <input type="file" name="csv" id="csv-load-input" className="csv-load-input" />
        <div className="drag-and-drop-area" onDragOver={e => {
          if (e.currentTarget.classList.contains("drag-and-drop-area")) {
            e.currentTarget.classList.add("drag-and-drop-area-active")
          }
        }} onDragLeave={e => {
          if (e.currentTarget.classList.contains("drag-and-drop-area")) {
            e.currentTarget.classList.remove("drag-and-drop-area-active")
          }
        }}>
          <FileUploadIcon fontSize="large" />
          <Typography>Перетащите CSV файл сюда или нажмите для выбора</Typography>
        </div>
        <h3>Требования к файлу:</h3>
        <ul>
          <li>Формат CSV, разделитель - ;</li>
          <li>Кодировка - UTF-8</li>
          <li>Обязательные колонки: product_id, product_name, quantity, zone, date</li>
        </ul>
        <div className="progress-wrapper">
          <LinearProgress variant="determinate" value={progress} />
          <Typography>{Math.round(progress)}% </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>Отмена</Button>
        <Button variant="contained" disabled>Загрузить</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CSVLoaderModal;