import { Button, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import "./HorizontalMenu.css"
import CSVLoaderModal from "../CSVLoaderModal/CSVLoaderModal";
import { useState } from "react";

function HorizontalMenu() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Paper elevation={10}>
        <nav className="menu">
          <ul className="menu-left-part">
            <li className="menu-item">
              <RouterLink to="/dashboard">Текущий мониторинг</RouterLink>
            </li>
            <li className="menu-item">
              <RouterLink to="/history">Исторические данные</RouterLink>
            </li>
          </ul>
          <ul className="menu-right-part">
            <li className="menu-item">
              <Button variant="outlined" startIcon={<FileUploadIcon />} onClick={() => setDialogIsOpen(true)}>Загрузить CSV</Button>
            </li>
          </ul>
        </nav>
      </Paper>
      <CSVLoaderModal open={dialogIsOpen} handleClose={() => setDialogIsOpen(false)}/>
    </>
  )
}

export default HorizontalMenu;