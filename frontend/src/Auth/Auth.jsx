import { TextField, Checkbox, FormControlLabel, Button, CircularProgress, Link, Alert } from "@mui/material";
import { useState } from "react";
import "./Auth.css"

function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [creds, setCreds] = useState({ "email": "", "password": "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [areCredsIncorrect, setAreCredsIncorrect] = useState(false);

  document.title = "Авторизация"

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();
    params.append("creds", JSON.stringify(creds));
    const response = fetch(`/api/login?${params}`, {
      method: "POST"
    });

    response.then(res => {
      const json = res.json()
      json.then(res => { 
        if (res.token) {
          if (rememberMe) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("name", res.name);
            localStorage.setItem("role", res.role);
          } else {
            sessionStorage.setItem("token", res.token);
            sessionStorage.setItem("name", res.name);
            sessionStorage.setItem("role", res.role);
          }
          setAreCredsIncorrect(false);
          location.href = "/dashboard";
        } else {
          setAreCredsIncorrect(true);
        }
       }, err => { console.log(err) });
      setIsLoading(false);
    },
      err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  return (
    <>
      <header>
        <img src="/logo.png" alt="Логотип Ростелекома" className="logo" height="50" />
      </header>
      <h1 className="auth-title">Вход</h1>
      {areCredsIncorrect ? <Alert sx={{maxWidth: "250px"}} severity="error">Неверный адрес электронной почты или пароль.</Alert> : ""}
      <form action="POST" className="auth-form" onSubmit={handleSubmit}>
        <TextField variant="outlined" label="E-mail" type="email" placeholder="ivanivanov@example.com" autoComplete="email" required onChange={event => setCreds({
          ...creds,
          "email": event.target.value
        })} />
        <TextField variant="outlined" label="Пароль" type="password" autoComplete="current-password" required onChange={event => setCreds({
          ...creds,
          "password": event.target.value
        })} />
        <FormControlLabel control={<Checkbox checked={rememberMe} onChange={event => setRememberMe(event.target.checked)}/>} label="Запомнить меня" />
        <Button sx={{ width: "100%", display: "flex", gap: "10px", justifyContent: "start" }} disabled={isLoading} type="submit" variant="contained">Войти <CircularProgress sx={{ display: isLoading ? "" : "none" }} color="inherit" size="1rem" /></Button>
      </form>
      <Link href="#" sx={{ display: "block", textAlign: "center" }}>Забыли пароль?</Link>
    </>
  )
}

export default Auth;