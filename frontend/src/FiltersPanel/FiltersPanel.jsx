import { Chip, Paper, Typography, Autocomplete, TextField, FormControlLabel, InputAdornment, Button, Checkbox } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { ruRU } from "@mui/x-date-pickers/locales";
import "dayjs/locale/ru"
import { createTheme, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import "./FiltersPanel.css"

const columnLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let rowNumbers = []

for (let i = 1; i <= 50; i++) {
  rowNumbers.push(i);
}

let zones = [];

for (let letter of columnLetters) {
  for (let number of rowNumbers) {
    zones.push(letter + number);
  }
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

function FiltersPanel() {
  return (
    <Paper>
      <h2 className="filters-title">Фильтры</h2>
      <form action="GET" className="filters-form">
        <div className="date-pickers">
          <ThemeProvider theme={localeTheme}>
            <div className="date-picker-with-label">
              <Typography>От: </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DatePicker sx={{ maxWidth: "250px" }} />
              </LocalizationProvider>
            </div>

            <div className="date-picker-with-label">
              <Typography>До: </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DatePicker sx={{ maxWidth: "250px" }} />
              </LocalizationProvider>
            </div>
          </ThemeProvider>
          <div className="chips">
            <Chip variant="outlined" label="Сегодня" />
            <Chip variant="outlined" label="Вчера" /><Chip variant="outlined" label="Эта неделя" /><Chip variant="outlined" label="Этот месяц" />
          </div>
        </div>
        <div className="autocompletes">
          <div className="autocomplete-with-label">
            <Typography>Зона склада: </Typography>
            <Autocomplete options={zones} sx={{ maxWidth: "250px" }} renderInput={(params) => <TextField variant="outlined" {...params} />} multiple noOptionsText="Ничего не нашлось" />
          </div>
          <div className="autocomplete-with-label">
            <Typography>Категория товаров: </Typography>
            <Autocomplete options={[]} sx={{ maxWidth: "250px" }} renderInput={(params) => <TextField variant="outlined" {...params} />} multiple noOptionsText="Ничего не нашлось" />
          </div>
          <div className="checkboxes">
            <FormControlLabel control={<Checkbox />} label="Все" />
            <FormControlLabel control={<Checkbox />} label="ОК" />
            <FormControlLabel control={<Checkbox />} label="Низкий остаток" />
            <FormControlLabel control={<Checkbox />} label="Критично" />
          </div>
        </div>
        <div className="search-goods-input">
          <Typography>Поиск по артикулу/названию</Typography>
          <TextField variant="outlined" slotProps={{
            input: {
              endAdornment: (<EndAdornment />)
            }
          }} />
        </div>
        <div className="buttons-panel">
          <Button variant="outlined">Применить фильтры</Button>
          <Button variant="outlined">Сбросить</Button>
        </div>
      </form>
    </Paper >
  )
}

export default FiltersPanel;