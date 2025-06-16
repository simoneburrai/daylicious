import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/Homepage"
import AdminHomePage from "./pages/AdminHomePage"


function App() {

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/admin" element={<AdminHomePage />}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
