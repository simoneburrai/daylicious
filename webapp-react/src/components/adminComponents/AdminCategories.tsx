import { useApiCall } from "../../context/ApiContext"
import API_URL from "../../config/apiUrl";
import { useEffect, useState } from "react";


export default function AdminCategories(){

    const [lang, setLang] = useState<"it"|"eng">("it");

    interface Category {
        category_id: number,
        name: {
            it: string,
            eng: string
        },
        description: {
            it: string,
            eng: string
        },
        category_slug: string,
    }

    const [categories, setCategories] = useState<Category[]>([]);

    const {apiCall, loading, error, result} = useApiCall();

    useEffect(()=> {
        apiCall(API_URL.CATEGORIES, "get");
           setCategories(result.categories);
    }, [])


    
   

    return <>
        {loading && <div>Caricamento Risultati in Corso</div>}
        {error && <div>{error.msg}</div>}
        {result && <div>
            {categories && categories.map(category=> <div key={category.category_id}>{category.name[lang]}</div>)}
            </div>}
    </>
}