import "./History.css"
import Header from "../Header/Header";
import HorizontalMenu from "../HorizontalMenu/HorizontalMenu";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import StatisticsBlock from "../StatisticsBlock/StatisticsBlock";
import ScansTable from "../ScansTable/ScansTable"
import ButtonsPanel from "../ButtonsPanel/ButtonsPanel"

function History() {
  document.title = "Исторические данные"

  return (
    <>
      <Header />
      <HorizontalMenu/>
      <FiltersPanel/>
      <StatisticsBlock/>
      <ScansTable/>
      <ButtonsPanel/>
    </>
  )
}

export default History;