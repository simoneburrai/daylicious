import { useApiCall } from "../../context/ApiContext"
import API_URL from "../../config/apiUrl";
import { useEffect } from "react";


export default function AdminCategories(){

    const {apiCall, loading, error, result} = useApiCall();

    useEffect(()=> {
        apiCall(API_URL.CATEGORIES, "get");
    }, [])

    console.log(result);
    
   

    return <div>Categories Table Page</div>
}