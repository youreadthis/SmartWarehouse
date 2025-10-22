import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import "./LatestScansTable.css"
import { useState } from "react";

function LatestScansTable() {
  const [scans, setScans] = useState([]);
  const [isAutoUpdated, setIsAutoUpdated] = useState(true);

  return (
    <TableContainer sx={{paddingInline: "24px", maxWidth: "calc(100% - 48px)"}}>
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
          {scans.map(scanObj =>
            <TableRow>
              <TableCell>{scanObj.time}</TableCell>
              <TableCell>{scanObj.id}</TableCell>
              <TableCell>{scanObj.zone}</TableCell>
              <TableCell>{scanObj.itemInfo}</TableCell>
              <TableCell>{scanObj.amount}</TableCell>
              <TableCell>{scanObj.status}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table >
    </TableContainer>
  )
}

export default LatestScansTable;