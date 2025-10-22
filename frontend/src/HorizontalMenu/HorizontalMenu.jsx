import { Link, Button, Paper } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import "./HorizontalMenu.css"

function HorizontalMenu() {
  return (
    <Paper>
      <nav className="menu">
        <ul className="menu-left-part">
          <li className="menu-item">
            <Link underline="hover">Текущий мониторинг</Link>
          </li>
          <li className="menu-item">
            <Link underline="hover">Исторические данные</Link>
          </li>
        </ul>
        <ul className="menu-right-part">
          <li className="menu-item">
            <Button variant="outlined" href="#" startIcon={<FileUploadIcon/>}>Загрузить CSV</Button>
          </li>
        </ul>
      </nav>
    </Paper>
  )
}

export default HorizontalMenu;