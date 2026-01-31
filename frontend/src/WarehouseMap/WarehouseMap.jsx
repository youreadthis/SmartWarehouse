import "./WarehouseMap.css"
import { Container, Typography, Tooltip, ButtonGroup, Button } from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { visuallyHidden } from '@mui/utils';
import { useState, useRef } from "react";

const NUMBER_OF_LETTERS = 26;
const NUMBER_OF_ROWS = 50;
const CELL_WIDTH = 22;

const squaresNumbers = [];
for (let i = 0; i < NUMBER_OF_LETTERS * NUMBER_OF_ROWS; i++) {
  squaresNumbers[i] = i + 1;
}

const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const rowNumbers = [];

for (let i = 0; i < NUMBER_OF_ROWS; i++) {
  rowNumbers[i] = i + 1;
}

function getZoneFromSquareNumber(squareNumber) {
  const letter = squareNumber % NUMBER_OF_LETTERS === 0 ? "Z" : letters[squareNumber % NUMBER_OF_LETTERS - 1];
  const row = Math.floor((squareNumber - 1) / NUMBER_OF_LETTERS) + 1;

  return `${letter}-${row}`
}

function WarehouseMap({ zonesStatuses, robotsData }) {
  const [scale, setScale] = useState(1.0);
  const [isMouseButtonHeld, setIsMouseButtonHeld] = useState(false);
  const [coords, setCoords] = useState([null, null]);
  const svgRef = useRef(null);

  function getColorOfZone(zone) {
    if (!zonesStatuses) {
      return "transparent";
    } else if (!zonesStatuses[zone] || zonesStatuses[zone] === "need_to_check") {
      return "#f7ee8aff";
    } else if (zonesStatuses[zone] === "checked_recently") {
      return "#75f084ff";
    } else if (zonesStatuses[zone] === "critical") {
      return "#f7ad78ff";
    }

    return "transparent";
  }

  function getColorOfRobot(batteryLevel) {
    if (batteryLevel < 20) return "#FF0000";
    if (batteryLevel < 25) return "#ffeb3b";
    return "#0b6c21";
  }

  function getTextOfZone(zone) {
    if (!zonesStatuses) {
      return `По зоне ${zone} нет данных`;
    } else if (zonesStatuses[zone] === "checked_recently") {
      return `Зона ${zone} проверена недавно, всё в порядке`;
    } else if (zonesStatuses[zone] === "critical") {
      return `В зоне ${zone} есть критические остатки`;
    } else if (zonesStatuses[zone] === "need_to_check") {
      return `Зону ${zone} нужно проверить`;
    }
    return `По зоне ${zone} нет данных`;
  }

  function clearDataAboutMove() {
    setIsMouseButtonHeld(false);
    setCoords([null, null]);

  }

  const STYLES_FOR_SCALE = { transform: `scale(${scale})`, transformOrigin: "top left" };

  function RobotWithTooltip({ id, batteryLevel, lastUpdate }) {
    return (
      <div>
        <Tooltip sx={{ bgcolor: "white", color: "black", width: "fit-content" }}
          title={<>
            <Typography>ID робота: {id}</Typography>
            <Typography>Заряд батареи: {batteryLevel}%</Typography>
            <Typography>Последнее обновление: {lastUpdate}</Typography>
          </>}>
          <SmartToyIcon sx={{ color: getColorOfRobot(batteryLevel), width: "20px", height: "20px" }} />
        </Tooltip>
      </div>
    )
  }

  return (
    <Container sx={{ margin: 0, padding: 0, maxWidth: "100%", overflow: "auto", display: "grid" }}>
      <div className="warehouse-map-wrapper"
        ref={svgRef}
        style={{ gap: `calc(10.5px * ${scale})` }}
        onMouseDown={event => {
          setIsMouseButtonHeld(true);
          setCoords([event.clientX, event.clientY]);
        }}
        onMouseUp={clearDataAboutMove}
        onMouseLeave={clearDataAboutMove}
        onMouseMove={event => {
          if (isMouseButtonHeld && svgRef.current) {
            const deltaX = event.clientX - coords[0];
            const deltaY = event.clientY - coords[1];
            svgRef.current.scrollBy(-deltaX, -deltaY);

            setCoords([event.clientX, event.clientY]);
          }
        }}
      >
        <div className="column-letters" style={STYLES_FOR_SCALE}>
          {
            letters.map(item =>
              <span className="column-letter" key={`column-${item}`}>{item}</span>
            )
          }
        </div>
        <div className="row-numbers" style={STYLES_FOR_SCALE}>
          {
            rowNumbers.map(item =>
              <span className="row-number" key={`row-${item}`}>
                {item}
              </span>
            )
          }
        </div>
        <svg width={NUMBER_OF_LETTERS * CELL_WIDTH + 1} height={NUMBER_OF_ROWS * CELL_WIDTH + 1}
          viewBox={`0 0 ${(NUMBER_OF_LETTERS * CELL_WIDTH + 1)} ${(NUMBER_OF_ROWS * CELL_WIDTH + 1)}`}
          style={STYLES_FOR_SCALE}
          className="warehouse-map"
          xmlns="http://www.w3.org/2000/svg"
        >
          {
            squaresNumbers.map(item =>
              <foreignObject width={20} height={20} x={CELL_WIDTH * (item % NUMBER_OF_LETTERS > 0 ? item % NUMBER_OF_LETTERS - 1 : NUMBER_OF_LETTERS - 1)} y={CELL_WIDTH * Math.floor((item - 1) / NUMBER_OF_LETTERS)} fill="transparent" stroke="transparent" key={getZoneFromSquareNumber(item)}>
                <div className="zone-rect" style={{ backgroundColor: getColorOfZone(getZoneFromSquareNumber(item)) }}>
                  <Typography sx={visuallyHidden}>{
                    getTextOfZone(getZoneFromSquareNumber(item))
                  }</Typography>
                  {
                    robotsData ? robotsData.filter(robot => robot["current_location"] === getZoneFromSquareNumber(item)).map(robot => <RobotWithTooltip
                      id={robot.id}
                      batteryLevel={robot["battery_level"]}
                      lastUpdate={robot["last_update"]}
                      key={robot.id}
                    />
                    ) : ""
                  }
                </div>
              </foreignObject>
            )
          }
        </svg>
      </div>
      <div className="map-buttons-panel">
        <ButtonGroup variant="contained">
          <Button disabled={scale.toFixed(1) == 1.5} onClick={() => setScale(scale + 0.1)}>
            +
            <Typography sx={visuallyHidden}>Увеличить карту (текущий масштаб: {scale})</Typography>
          </Button>
          <Button disabled={scale.toFixed(1) == 1.0} onClick={() => setScale(scale - 0.1)}>
            -
            <Typography sx={visuallyHidden}>Уменьшить карту (текущий масштаб: {scale})</Typography>
          </Button>
        </ButtonGroup>
      </div>
    </Container>
  )
}

export default WarehouseMap;