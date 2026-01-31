import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, Typography } from "@mui/material";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { visuallyHidden } from "@mui/utils"
import "./LatestScansTable.css"
import { useRef } from "react";

function getTextOfBadge(quantity) {
  if (quantity > 20) {
    return "Товара достаточно";
  }
  if (quantity > 10) {
    return "Товар заканчивается, рекомендуем пополнить запасы";
  }

  return "Товара очень мало, нужно срочно пополнить запасы";
}

function LatestScansTable({ scans, isAutoUpdated, setIsAutoUpdated }) {
  const ref = useRef(null);

  if (ref.current && isAutoUpdated) {
    ref.current.scrollTo(0, 0);
  }

  return (
    <>
      <div ref={ref} className="table-wrapper">
        <TableContainer sx={{ paddingInline: "24px", position: "relative" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Время</TableCell>
                <TableCell>ID робота</TableCell>
                <TableCell>Зона склада</TableCell>
                <TableCell>Товар</TableCell>
                <TableCell>Количество</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!scans.length ? <TableRow><TableCell colSpan={6}>Последние сканирования будут отображаться здесь</TableCell></TableRow> : ""}
              {scans.map((scanObj, index) =>
                <TableRow key={index}>
                  <TableCell>{scanObj.scanned_at}</TableCell>
                  <TableCell>{scanObj.robot_id}</TableCell>
                  <TableCell>{scanObj.zone}</TableCell>
                  <TableCell>{scanObj.product_name} арт.: {scanObj.product_id}</TableCell>
                  <TableCell>{scanObj.quantity}</TableCell>
                  <TableCell><div className={`scan-badge ${scanObj.quantity > 20 ? "scan-badge-ok" : scanObj.quantity > 10 ? "scan-badge-low" : "scan-badge-critical"}`}><Typography sx={visuallyHidden}>{getTextOfBadge(scanObj.quantity)}</Typography></div></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table >
        </TableContainer>
      </div>
      <Button
        sx={{ marginInline: "24px" }}
        variant="contained"
        startIcon={isAutoUpdated ? <PauseIcon /> : <PlayArrowIcon />}
        onClick={() => setIsAutoUpdated(!isAutoUpdated)}>
        {isAutoUpdated ? "Остановить автообновление" : "Включить автообновление"}
      </Button>
    </>
  )
}

export default LatestScansTable;