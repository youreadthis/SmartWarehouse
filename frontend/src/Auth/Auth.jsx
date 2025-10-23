import { TextField, Checkbox, FormControlLabel, Button, CircularProgress, Link } from "@mui/material";
import { useState } from "react";
import "./Auth.css"

function Auth() {
  const [isLoading, setIsLoading] = useState(false);

  document.title = "Авторизация"

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <>
      <header>
        <img src="/logo.png" alt="Логотип Ростелекома" className="logo" height="50" />
      </header>
      <h1 className="auth-title">Вход</h1>
      <form action="POST" className="auth-form" onSubmit={handleSubmit}>
        <TextField variant="outlined" label="E-mail" type="email" placeholder="ivanivanov@example.com" autoComplete="email" required/>
        <TextField variant="outlined" label="Пароль" type="password" autoComplete="current-password" required/>
        <FormControlLabel control={<Checkbox defaultChecked/>} label="Запомнить меня"/>
        <Button sx={{width: "100%", display: "flex", gap: "10px", justifyContent: "start"}}disabled={isLoading} type="submit" variant="contained">Войти <CircularProgress sx={{display: isLoading ? "" : "none"}} color="inherit" size="1rem"/></Button>
      </form>
      <Link href="#" sx={{display: "block", textAlign: "center"}}>Забыли пароль?</Link>
    </>
  )
}

export default Auth;