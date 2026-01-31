import { TableContainer, Table, TableHead, TableBody, TableRow, TableFooter, TableCell, TablePagination, TableSortLabel, Checkbox, Button } from "@mui/material";
import { useState, useEffect } from "react";

const headCells = ["Дата и время проверки", "ID робота", "Зона склада", "Артикул товара", "Название товара", "Количество", "Статус"];
const englishMatches = ["scanned_at", "robot_id", "zone", "product_id", "product_name", "quantity", "status"]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function ScansTable({ filters, chosenRows, onChooseRow }) {
  const SCANS_PER_FETCH = 100;
  const [scans, setScans] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(SCANS_PER_FETCH);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [canLoadMore, setCanLoadMore] = useState(0);
  const [isFetched, setIsFetched] = useState(false);
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    setIsFetched(false);
    setStart(0);
    setEnd(SCANS_PER_FETCH);
    setScans([]);
  }, [filters])

  function checkIfCanLoadMore(page) {
    if ((page + 1) * rowsPerPage == start) {
      const testPromiseJson = fetchScans();
      testPromiseJson.then((scans) => {
        if (scans.length) {
          setCanLoadMore(true);
        } else {
          setCanLoadMore(false);
        }
      })
    } else {
      setCanLoadMore(false);
    }
  }

  function handlePageChange(event, newPage) {
    setPage(newPage);
    checkIfCanLoadMore(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    checkIfCanLoadMore(0);
  };

  async function fetchScans() {
    const params = new URLSearchParams();
    params.append("start", start);
    params.append("end", end);

    for (let key in filters) {
      params.append(key, filters[key]);
    }

    const response = await fetch(`/api/history?${params}`);
    if (response.ok) {
      const json = await response.json();
      return JSON.parse(json);
    }
  }

  function areArraysEqual(arr1, arr2) {
    arr1.sort();
    arr2.sort();
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  if (!isFetched) {
    const jsonPromise = fetchScans();
    jsonPromise.then(res => {
      setScans(scans.concat(res));
      setIsFetched(true);
      setStart(start + SCANS_PER_FETCH);
      setEnd(end + SCANS_PER_FETCH);
    }, err => {
      setIsFetched(true);
    });
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={10}>Таблица сканирований</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Checkbox onChange={event => {
              if (event.target.checked) {
                onChooseRow(scans);
              } else {
                onChooseRow([]);
              }
            }}
              checked={areArraysEqual(chosenRows, scans) && chosenRows.length} /></TableCell>
            {headCells.map((item, index) =>
              <TableCell key={`cell-${item}`}>
                <TableSortLabel onClick={() => {
                  const comparator = getComparator(order, englishMatches[index]);
                  setScans(scans.sort(comparator));
                  setOrder(order === "asc" ? "desc" : "asc");
                }}
                direction={order}>
                  {item}
                </TableSortLabel>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {!scans?.length ? <TableRow><TableCell colSpan={10}>{isFetched ? "Сканирований пока нет" : "Загрузка..."}</TableCell></TableRow> : ""}
          {scans?.slice(rowsPerPage * page, rowsPerPage * (page + 1)).map((item, index) =>
            <TableRow key={`row-${index}`}>
              <TableCell>
                <Checkbox id={item.id} checked={chosenRows.includes(item)} onChange={event => {
                  onChooseRow(event.target.checked ? chosenRows.concat([item]) : chosenRows.filter(row => row !== item))
                }} />
              </TableCell>
              <TableCell>{item.scanned_at}</TableCell>
              <TableCell>{item.robot_id}</TableCell>
              <TableCell>{item.zone}</TableCell>
              <TableCell>{item.product_id}</TableCell>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.status == "LOW_STOCK" ? "Осталось мало" : item.status == "CRITICAL" ? "Критический остаток" : item.status}</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={["20", "50", "100"]}
              count={scans?.length}
              page={page} onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="Записей на странице: "
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`} />
          </TableRow>
          {canLoadMore ?
            <TableRow>
              <TableCell colSpan={10}>
                <Button variant="contained" onClick={() => {
                  setIsFetched(false);
                  setCanLoadMore(false);
                }}>
                  Загрузить ещё
                </Button>
              </TableCell>
            </TableRow> :
            ""}
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default ScansTable;