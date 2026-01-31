import { Dialog, DialogContent, DialogActions, DialogTitle, LinearProgress, Typography, Button, Snackbar, Alert } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useState, useRef } from "react";
import "./CSVLoaderModal.css"

function CSVLoaderModal({ open, handleClose }) {
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState("");
  const [previewLines, setPreviewLines] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [snackBarData, setSnackBarData] = useState({ type: "", message: "" });
  const refToFileInput = useRef(null);

  function checkFileOnServer(fileAsBytes) {
    const response = fetch("/api/csv-validate", {
      method: "POST",
      body: fileAsBytes
    });

    response.then(
      res => {
        const json = res.json();
        json.then(res => {
          if (res.preview) {
            setPreviewLines(res.preview)
            setIsValidated(true);
            setSnackBarData({
              type: "success",
              message: res.message
            });
            setTimeout(() => setSnackBarData({}), 5000);
          } else {
            setSnackBarData({
              type: "error",
              message: res.detail
            });
            setTimeout(() => setSnackBarData({}), 5000);
            onStopOperation();
          }
        });
      });
  }

  function requestFileWriting() {
    const response = fetch("/api/csv-write", {
      method: "POST"
    })
    response.then(
      res => {
        const json = res.json();
        json.then(resJSON => {
          setSnackBarData({
            type: res.ok ? "success" : "error",
            message: resJSON.message || resJSON.detail
          });

          setTimeout(() => setSnackBarData({}), 5000);
          onStopOperation();
        })
      }
    )
  }

  function getProgress() {
    const response = fetch("/api/csv-progress");
    response.then(res => {
      const json = res.json()
      json.then(res => {
        if (res.progress) {
          setProgress(res.progress);
        }
      })
    });
  }

  if (isFileLoading && progress < 100) {
    setTimeout(getProgress, 500);
  }

  function onStopOperation() {
    setFilename("");
    setIsValidated(false);
    setIsFileLoading(false);
    setPreviewLines([]);
    setProgress(0);
    refToFileInput.current.value = "";
  }

  return (
    <>
      <Dialog open={open} onClose={onStopOperation}>
        <DialogTitle>Загрузка данных инвентаризации</DialogTitle>
        <DialogContent>
          <input type="file" name="csv" id="csv-load-input" className="csv-load-input"
            ref={refToFileInput}
            onChange={e => {
              setIsValidated(false);
              setFilename(e.target.value.slice(e.target.value.lastIndexOf("\\") + 1)); //пока что только для винды
              if (e.target.value) {
                const buf = e.target.files[0].arrayBuffer();
                buf.then(result => {
                  checkFileOnServer(result);
                })
              }
            }}
            accept=".csv" />
          <div className="drag-and-drop-area" style={{ textAlign: filename ? "left" : "center", display: !previewLines.length ? "" : "none" }}
            onDragOver={e => {
              e.preventDefault();
              e.stopPropagation();
              if (e.currentTarget.classList.contains("drag-and-drop-area")) {
                e.currentTarget.classList.add("drag-and-drop-area-active")
              }
            }}
            onDragLeave={e => {
              e.preventDefault();
              e.stopPropagation();
              if (e.currentTarget.classList.contains("drag-and-drop-area")) {
                e.currentTarget.classList.remove("drag-and-drop-area-active")
              }
            }}

            onDrop={e => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = "none";
              const firstFile = e.dataTransfer.files[0];

              if (firstFile) {
                setIsValidated(false);
                setFilename(firstFile.name);
                const buf = firstFile.arrayBuffer();
                buf.then(result => {
                  checkFileOnServer(result);
                })
              }
            }}

            onClick={() => {
              if (refToFileInput.current) {
                refToFileInput.current.value = "";
                refToFileInput.current.click();
              }
            }}
          >{
              filename ?
                previewLines.length ?
                  ""
                  :
                  <>
                    <DescriptionOutlinedIcon sx={{ marginRight: "5px", verticalAlign: "middle" }} />
                    {filename}
                  </>
                :
                <>
                  <FileUploadIcon fontSize="large" />
                  <Typography>Перетащите CSV файл сюда или нажмите для выбора</Typography>
                </>
            }
          </div>
          {
            previewLines.length ? <>
              <h3>Область предпросмотра</h3>
              <table className="preview-area">
                <thead>
                  <tr>
                    {
                      previewLines[0].map((header, index) =>
                        <th key={index}>{header}</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {previewLines.slice(1).map((item, index) =>
                    <tr key={index}>
                      {
                        item.map((cellContent, index) => <td key={index}>{cellContent}</td>)
                      }
                    </tr>
                  )}
                </tbody>
              </table>
            </> : ""
          }
          <h3>Требования к файлу:</h3>
          <ul>
            <li>Формат CSV, разделитель - ;</li>
            <li>Кодировка - UTF-8</li>
            <li>Обязательные колонки: product_id, product_name, quantity, zone, date</li>
          </ul>
          {isFileLoading ?
            <div className="progress-wrapper">
              <LinearProgress variant="determinate" value={progress} />
              <Typography>{Math.round(progress)}% </Typography>
            </div> : ""
          }
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => {
            onStopOperation();
            handleClose()
          }}>Отмена</Button>
          <Button variant="contained"
            disabled={!isValidated}
            onClick={() => {
              setIsFileLoading(true);
              requestFileWriting();
            }}
          >Загрузить</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackBarData.message && snackBarData.type} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackBarData.type}>{snackBarData.message}</Alert>
      </Snackbar>
    </>
  )
}

export default CSVLoaderModal;