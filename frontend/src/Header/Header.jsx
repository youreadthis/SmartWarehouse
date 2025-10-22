import { AppBar, Button, Container, ThemeProvider, createTheme } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { grey } from "@mui/material/colors"
import "./Header.css"

const appBarTheme = createTheme({
  palette: {
    primary: {
      main: grey[200]
    }
  }
})

function Header() {
  return (
    <ThemeProvider theme={appBarTheme}>
      <AppBar position="sticky">
        <Container sx={{ display: "flex", justifyContent: "space-between", marginBlock: "30px", alignItems: "center", marginLeft: "0", marginRight: "0", maxWidth: { lg: "100%" } }}>
          <div className="left-part">
            <img src="/logo.png" alt="Логотип Ростелекома" className="logo" height="50" />
            <h1 className="header-title">Умный склад</h1>
          </div>
          <div className="right-part">
            <div className="user-info">
              <span>Иван</span> (<span>Оператор</span>)
            </div>
            <Button startIcon={<LogoutIcon />} variant="contained">Выход</Button>
          </div>
        </Container>
      </AppBar>
    </ThemeProvider>

  )
}

export default Header;