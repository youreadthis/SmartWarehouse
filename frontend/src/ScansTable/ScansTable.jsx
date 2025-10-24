import { TableContainer, Table, TableHead, TableBody, TableRow, TableFooter, TableCell, TablePagination, TableSortLabel, Checkbox } from "@mui/material";

const headCells = ["Дата и время проверки", "ID робота", "Зона склада", "Артикул товара", "Название товара", "Ожидаемое количество", "Фактическое количество", "Расхождение", "Статус"]

const scans = []

function ScansTable() {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={10}>Таблица сканирований</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Checkbox /></TableCell>
            {headCells.map(item =>
              <TableCell key={`cell-${item}`}>
                <TableSortLabel> 
                  {item}
                </TableSortLabel>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {!scans.length ? <TableRow><TableCell colSpan={10}>Сканирований пока нет</TableCell></TableRow> : ""}
          {scans.map((item, index) =>
            <TableRow key={`row-${index}`}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{item.checkDateTime}</TableCell>
              <TableCell>{item.robotID}</TableCell>
              <TableCell>{item.zone}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.expectedAmount}</TableCell>
              <TableCell>{item.realAmount}</TableCell>
              <TableCell>{item.diff}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination rowsPerPageOptions={["20", "50", "100"]} count={scans.length} page={0} onPageChange={() => {}} rowsPerPage={0} labelRowsPerPage="Записей на странице: "/>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default ScansTable;