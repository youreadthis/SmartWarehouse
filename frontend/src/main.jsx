import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary"
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './Dashboard.jsx'
import Auth from "./Auth/Auth.jsx"
import History from "./History/History.jsx"

function Fallback({ error }) {
  document.title = "Произошла ошибка";
  return (
    <div className="error-message">
      <h1>Произошла ошибка, уже работаем над ней</h1>
      <p>Информация для разработчиков об ошибке:</p>
      <code>{error.message}</code>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={Fallback} key={location.pathname}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/login' element={<Auth />} />
          <Route path='/history' element={<History />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
)
