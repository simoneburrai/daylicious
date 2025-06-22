import { Link, Outlet } from "react-router-dom"

export default function AdminHomePage (){

    return <div>

        <h1>Homepage Admin</h1>
        
        <h3>Seleziona la tabella che vuoi andare a modificare</h3>

        <div>
            <Link className="btn btn-secondary" to="/admin/ingredients">Ingredients</Link>
            <Link className="btn btn-secondary" to="/admin/ingredient-categories">Ingredient Categories</Link>
            <Link className="btn btn-secondary"to="/admin/categories">Categories</Link>
            <Link className="btn btn-secondary" to="/admin/category-values">Category Values</Link>
            <Link className="btn btn-secondary" to="/admin/recipes">Recipes</Link>
        </div>

        <Outlet/>
    </div>

}