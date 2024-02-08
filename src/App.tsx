import { ThemeProvider } from "styled-components"
import { defaultTheme } from "./styles/themes/default"
import { GlobalStyle } from "./styles/themes/global"
import { Router } from "./components/Router"
import { BrowserRouter } from "react-router-dom"


function App() {


  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
