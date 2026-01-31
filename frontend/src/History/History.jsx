import "./History.css"
import Header from "../Header/Header";
import HorizontalMenu from "../HorizontalMenu/HorizontalMenu";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import StatisticsBlock from "../StatisticsBlock/StatisticsBlock";
import ScansTable from "../ScansTable/ScansTable"
import ButtonsPanel from "../ButtonsPanel/ButtonsPanel"
import { useState } from "react";

function History() {
  if (!localStorage.getItem("token")) {
    location.href = "/login";
  }
  
  document.title = "Исторические данные"
  let dateFrom = new Date();
  dateFrom = dateFrom.toISOString();
  dateFrom = dateFrom.slice(0, dateFrom.indexOf("T"));

  let dateTo = new Date();
  dateTo = dateTo.toISOString();
  dateTo = dateTo.slice(0, dateTo.indexOf("T"));

  const [filters, setFilters] = useState({
    statuses: ["OK", "LOW_STOCK", "CRITICAL"],
    dateFrom: dateFrom,
    dateTo: dateTo
  });
  const [chosenRows, setChosenRows] = useState([]);

  return (
    <>
      <Header />
      <HorizontalMenu/>
      <FiltersPanel onApplyFilters={setFilters} filters={filters}/>
      <StatisticsBlock filters={filters}/>
      <ScansTable filters={filters} chosenRows={chosenRows} onChooseRow={setChosenRows}/>
      <ButtonsPanel filters={filters} chosenRows={chosenRows}/>
    </>
  )
}

export default History;