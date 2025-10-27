import { AppBar, Button, Container, ThemeProvider, createTheme, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { grey } from "@mui/material/colors"
import { visuallyHidden } from "@mui/utils"
import { styled } from '@mui/material/styles';
import "./Header.css"

const appBarTheme = createTheme({
  palette: {
    primary: {
      main: grey[200]
    }
  }
})

const Wrapper = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: visuallyHidden
}))

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
            <RouterLink to="/login">

              <Button startIcon={<LogoutIcon />} variant="contained" sx={{
                '& .MuiButton-startIcon': {
                  marginRight: '0',
                },
              }}>
                <Wrapper>
                  <Typography sx={{ sm: visuallyHidden }}>Выход</Typography></Wrapper></Button>
            </RouterLink>
          </div>
        </Container>
      </AppBar>
    </ThemeProvider>

  )
}

export default Header;