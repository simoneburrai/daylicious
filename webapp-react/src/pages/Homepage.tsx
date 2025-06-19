import axios from "axios";
import { useEffect, useState } from "react"


export default function HomePage (){

    const [ingredients, setIngredients] = useState([]);

    useEffect(()=> {
        axios.get("localhost:3000/api/ingredients")
        .then(response => setIngredients(response.data))
    }, [])
 return <div>
    {ingredients.map((ingredient) => <div>{ingredient.name}</div>)}
 </div>
}