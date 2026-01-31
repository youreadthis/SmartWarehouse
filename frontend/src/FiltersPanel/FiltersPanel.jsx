import { Chip, Paper, Typography, Autocomplete, TextField, FormControlLabel, InputAdornment, Button, Checkbox } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { ruRU } from "@mui/x-date-pickers/locales";
import "dayjs/locale/ru"
import { createTheme, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import "./FiltersPanel.css"
import { useState } from "react";
import dayjs from "dayjs";

const columnLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let zones = [];

for (let letter of columnLetters) {
  zones.push(letter);
}

function EndAdornment() {
  return (
    <InputAdornment>
      <SearchIcon />
    </InputAdornment>
  )
}

const localeTheme = createTheme(
  ruRU
);

function FiltersPanel({ onApplyFilters, filters }) {
  const [tempFilters, setTempFilters] = useState(filters);
  return (
    <Paper>
      <h2 className="filters-title">Фильтры</h2>
      <form action="GET" className="filters-form">
        <div className="date-pickers">
          <ThemeProvider theme={localeTheme}>
            <div className="date-picker-with-label">
              <Typography>От: </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DatePicker value={dayjs(tempFilters.dateFrom)} sx={{ maxWidth: "250px" }} onChange={(chosenDate) => {
                  if (chosenDate.unix() * 1000 > Date.parse(tempFilters.dateTo)) {
                    const tempDate = tempFilters.dateTo;
                    let newDateTo = chosenDate.toDate();
                    newDateTo = newDateTo.toISOString();
                    setTempFilters({
                      ...tempFilters,
                      dateTo: newDateTo,
                      dateFrom: tempDate
                    });
                  } else {
                    let newDateFrom = chosenDate.toDate().toISOString();

                    setTempFilters({
                      ...tempFilters,
                      dateFrom: newDateFrom
                    });
                  }
                }} />
              </LocalizationProvider>
            </div>

            <div className="date-picker-with-label">
              <Typography>До: </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DatePicker value={dayjs(tempFilters.dateTo)} sx={{ maxWidth: "250px" }} onChange={(chosenDate) => {
                  if (chosenDate.unix() * 1000 < Date.parse(tempFilters.dateFrom)) {
                    const tempDate = tempFilters.dateFrom;
                    let newDateFrom = chosenDate.toDate().toISOString();
                    setTempFilters({
                      ...tempFilters,
                      dateFrom: newDateFrom.slice(0, newDateFrom.indexOf("T")),
                      dateTo: tempDate
                    });
                  } else {
                    let newDateTo = chosenDate.toDate().toISOString();

                    setTempFilters({
                      ...tempFilters,
                      dateTo: newDateTo
                    })
                  }
                }} />
              </LocalizationProvider>
            </div>
          </ThemeProvider>
          <div className="chips">
            <Chip variant="outlined" label="Сегодня" onClick={() => {
              let today = new Date().toISOString();

              setTempFilters({
                ...tempFilters,
                dateFrom: today,
                dateTo: today
              });
            }} />
            <Chip variant="outlined" label="Вчера" onClick={() => {
              let yesterday = new Date();
              let currentDay = yesterday.getDate();
              yesterday.setDate(currentDay - 1);

              yesterday = yesterday.toISOString();

              setTempFilters({
                ...tempFilters,
                dateFrom: yesterday,
                dateTo: yesterday
              });
            }} />
            <Chip variant="outlined" label="Эта неделя" onClick={() => {
              let currentWeekDay = new Date().getDay();
              if (currentWeekDay === 0) currentWeekDay = 7;
              let currentDate = new Date().getDate();

              let monday = new Date();
              monday.setDate(currentDate - currentWeekDay + 1);
              monday = monday.toISOString();

              let sunday = new Date();
              sunday.setDate(currentDate + 7 - currentWeekDay);
              sunday = sunday.toISOString();

              setTempFilters({
                ...tempFilters,
                dateFrom: monday,
                dateTo: sunday
              });
            }} />
            <Chip variant="outlined" label="Этот месяц" onClick={() => {
              let firstDay = new Date();
              firstDay.setDate(1);
              firstDay = firstDay.toISOString();

              let lastDay = new Date();
              lastDay.setFullYear(lastDay.getFullYear(), lastDay.getMonth() + 1, 0);
              lastDay = lastDay.toISOString();
              setTempFilters({
                ...tempFilters,
                dateFrom: firstDay,
                dateTo: lastDay
              });
            }} />
          </div>
        </div>
        <div className="autocompletes">
          <div className="autocomplete-with-label">
            <Typography>Зона склада: </Typography>
            <Autocomplete options={zones} sx={{ maxWidth: "250px" }} renderInput={(params) => <TextField variant="outlined" {...params} />} multiple noOptionsText="Ничего не нашлось" onChange={(event, newValue) => {
              setTempFilters({
                ...tempFilters,
                zones: newValue
              });
            }} />
          </div>
          <div className="autocomplete-with-label">
            <Typography>Категория товаров: </Typography>
            <Autocomplete options={[]} sx={{ maxWidth: "250px" }} renderInput={(params) => <TextField variant="outlined" {...params} />} multiple noOptionsText="Ничего не нашлось" />
          </div>
          <div className="checkboxes">
            <FormControlLabel control={<Checkbox checked={tempFilters.statuses.length === 3} onChange={event => {
              setTempFilters({
                ...tempFilters,
                statuses: event.target.checked ? ["OK", "LOW_STOCK", "CRITICAL"] : []
              })
            }} />} label="Все" />
            <FormControlLabel control={<Checkbox checked={tempFilters.statuses.includes("OK")} onChange={event => {
              setTempFilters({
                ...tempFilters,
                statuses: event.target.checked ? tempFilters.statuses.concat(["OK"]): tempFilters.statuses.filter(item => item !== "OK")
              });
            }
            } />} label="ОК" />
            <FormControlLabel control={<Checkbox checked={tempFilters.statuses.includes("LOW_STOCK")} onChange={event => setTempFilters({
              ...tempFilters,
              statuses: event.target.checked ? tempFilters.statuses.concat(["LOW_STOCK"]): tempFilters.statuses.filter(item => item !== "LOW_STOCK")
            })
            } />} label="Низкий остаток" />
            <FormControlLabel control={<Checkbox checked={tempFilters.statuses.includes("CRITICAL")} onChange={event => setTempFilters({
              ...tempFilters,
              statuses: event.target.checked ? tempFilters.statuses.concat(["CRITICAL"]): tempFilters.statuses.filter(item => item !== "CRITICAL")
            })
            } />} label="Критично" />
          </div>
        </div>
        <div className="search-goods-input">
          <Typography>Поиск по артикулу/названию</Typography>
          <TextField variant="outlined" slotProps={{
            input: {
              endAdornment: (<EndAdornment />)
            }
          }} onChange={event => setTempFilters({
            ...tempFilters,
            nameOrSKU: event.target.value
          })} />
        </div>
        <div className="buttons-panel">
          <Button variant="outlined" onClick={() => onApplyFilters(tempFilters)}>Применить фильтры</Button>
          <Button variant="outlined" onClick={() => {
            onApplyFilters({
              statuses: ["OK", "LOW_STOCK", "CRITICAL"]
            });
            setTempFilters({
              statuses: ["OK", "LOW_STOCK", "CRITICAL"]
            });
          }}>Сбросить</Button>
        </div>
      </form>
    </Paper >
  )
}

export default FiltersPanel;