import { Paper, Button, Typography } from "@mui/material";
import { useState } from "react";
import ReplayIcon from '@mui/icons-material/Replay';
import { visuallyHidden } from '@mui/utils';

function AIPrediction() {
  const [endingGoods, setEndingGoods] = useState([]);
  const [reliability, setReliability] = useState(100);

  return (
    <Paper sx={{marginLeft: "24px", padding: "10px", marginBottom: "20px"}}>
      <h3>Прогноз от ИИ на следующие 7 дней</h3>
      <span className="additional-text">{endingGoods.length ? "Эти товары могут скоро закончиться" : "Товары, которые скоро могут закончиться, не найдены"}</span>
      <ol>
        {endingGoods.map(item =>
          <>
            <li>{item.name}</li>
            <ol>
              <li>Текущий остаток (шт): {item.remain}</li>
              <li>Прогнозируемая дата исчерпания: {item.dateOfEnd}</li>
              <li>Рекомендуется заказать (шт): {item.recommendedAmount}</li>
            </ol>
          </>
        )}
      </ol>
      <Button startIcon={<ReplayIcon />}>Обновить прогноз</Button>
      {endingGoods.length ? 
        <span className="reliability-value">
          Достоверность прогноза: {reliability}%
        </span> : ""
      }

      <div className="ws-indicator ws-indicator-active">
        <Typography sx={visuallyHidden}>WebSocket-соединение активно</Typography>
      </div>
    </Paper>
  )
}

export default AIPrediction;