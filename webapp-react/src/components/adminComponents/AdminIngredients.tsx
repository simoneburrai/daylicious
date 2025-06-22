import { useApiCall } from "../../context/ApiContext"
import API_URL from "../../config/apiUrl";
import { useEffect, useState } from "react";


export default function AdminIngredients(){

    const [lang, setLang] = useState<"it"|"eng">("it");

    interface Ingredient {
        ingredient_id: number
        ing_category_id: number,
        name: {
            it: string,
            eng: string
        },
        description: {
            it: string,
            eng: string
        },
        ingredient_slug: string,
        illustration_url: string | null
    }

    interface IngredientsApiResponse {
    ingredients: Ingredient[];
    msg: string;
    // ...altre proprietà che la risposta dell'API degli ingredienti potrebbe avere
}
   

    const {apiCall, loading, error, result} = useApiCall();

    useEffect(()=> {
        apiCall(API_URL.INGREDIENTS, "get");
    }, [apiCall])

     const ingredients : Ingredient[] = result && (result as IngredientsApiResponse).ingredients; 
    
   

    return <>
        {loading && <div>Caricamento Risultati in Corso</div>}
        {error && <div>{error.msg}</div>}
        {result && <div>
            {ingredients && ingredients.map(ingredient=> <div key={ingredient.ingredient_id}>{ingredient.name[lang]}</div>)}
            </div>}
    </>
}