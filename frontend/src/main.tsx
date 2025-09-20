import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { defaultTheme, Provider } from '@adobe/react-spectrum'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <Provider theme={defaultTheme}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>,
)
