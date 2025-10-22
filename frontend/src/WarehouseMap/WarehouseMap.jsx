import "./WarehouseMap.css"
import { Container } from "@mui/material";

const squaresNumbers = [];
for (let i = 0; i < 26 * 50; i++) {
  squaresNumbers[i] = i + 1;
}

const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const rowNumbers = [];

for (let i = 0; i < 50; i++) {
  rowNumbers[i] = i + 1;
}

function WarehouseMap() {
  return (
    <Container sx={{margin: 0, padding: 0, maxWidth: "100%", overflow: "auto", display: "grid", gridTemplateColumns: "repeat(2, auto)", columnGap: "10px"}}>
      <div className="column-letters">
        {
          letters.map(item => 
            <span className="column-letter" key={`column-${item}`}>{item}</span>
          )
        }
      </div>
      <div className="row-numbers">
        {
          rowNumbers.map(item => 
            <span className="row-number" key={`row-${item}`}>
              {item}
            </span>
          )
        }
      </div>
      <svg width={26 * 22 + 1} height={50 * 22 + 1} className="warehouse-map">
        {
          squaresNumbers.map(item =>
            <rect width={20} height={20} x={((item - 1) % 26) * 22 + 1} y={Math.trunc((item - 1) / 26) * 22 + 1} strokeWidth={1} stroke="#D3D3D3" fill="transparent" key={item}>
            </rect>
          )
        }
      </svg>
    </Container>
  )
}

export default WarehouseMap;