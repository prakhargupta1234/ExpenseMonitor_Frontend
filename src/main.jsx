import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { startKeepAlive } from './util/keepAlive.js'

// Keep backend server alive (Render free tier)
// To disable, comment out the line below
startKeepAlive(5);

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>


)