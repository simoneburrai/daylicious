import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminHomePage from "./pages/AdminHomepage"
import AdminIngredients from "./components/adminComponents/AdminIngredients"
import AdminCategories from "./components/adminComponents/AdminCategories"
import AdminCategoryValues from "./components/adminComponents/AdminCategoryValues"
import AdminRecipes from "./components/adminComponents/AdminRecipes"
import AdminIngredientCategories from "./components/adminComponents/AdminIngredientCategories"
import { ApiProvider } from "./context/ApiContext"

function App() {

  return (
  <ApiProvider>
    <BrowserRouter>
      <Routes>
          <Route path="/admin/*" element={<AdminHomePage/>}>
            <Route path="ingredients" element={<AdminIngredients/>}/>
            <Route path="categories" element={<AdminCategories/>}/>
            <Route path="ingredient-categories" element={<AdminIngredientCategories/>}/>
            <Route path="category-values" element={<AdminCategoryValues/>}/>
            <Route path="recipes" element={<AdminRecipes/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  </ApiProvider>
  )
}

export default App
