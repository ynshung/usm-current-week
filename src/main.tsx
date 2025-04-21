import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GitHubCorner from './GitHubCorner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GitHubCorner link='https://github.com/ynshung/usm-current-week' />
    <App />
  </StrictMode>,
)
