import { Link, Button, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import "./HorizontalMenu.css"

function HorizontalMenu() {
  return (
    <Paper>
      <nav className="menu">
        <ul className="menu-left-part">
          <li className="menu-item">
            <RouterLink to="">Текущий мониторинг</RouterLink>
          </li>
          <li className="menu-item">
            <RouterLink to="/history">Исторические данные</RouterLink>
          </li>
        </ul>
        <ul className="menu-right-part">
          <li className="menu-item">
            <Button variant="outlined" startIcon={<FileUploadIcon />}>Загрузить CSV</Button>
          </li>
        </ul>
      </nav>
    </Paper>
  )
}

export default HorizontalMenu;