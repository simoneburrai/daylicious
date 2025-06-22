import { useApiCall } from "../../context/ApiContext"
import API_URL from "../../config/apiUrl";
import { useEffect, useState } from "react";
import { type IngCategoriesApiResponse, type IngCategory } from "../../types/ApiTypes";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography} from "@mui/material";   



export default function AdminIngredientCategories(){

    const [lang, setLang] = useState<"it"|"eng">("it");

   

    const {apiCall, loading, error, result} = useApiCall();

    useEffect(()=> {
        apiCall(API_URL.INGREDIENT_CATEGORIES, "get");
    }, [apiCall])

     const ingredientCategories : IngCategory[] = result && (result as IngCategoriesApiResponse).ingredientCategories ? (result as IngCategoriesApiResponse).ingredientCategories : [];

     return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Gestione Categorie Ingredienti</Typography>
            {loading && <div>Caricamento Risultati in Corso</div>}
            {error && <div>Errore: {error?.msg || "Si è verificato un errore."}</div>}
            {ingredientCategories.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="Tabella Ingredienti Amministrazione">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Categoria</TableCell>
                                <TableCell>Nome (it)</TableCell>
                                <TableCell>Nome (eng)</TableCell>
                                 <TableCell>Descrizione (it)</TableCell>
                                <TableCell>Descrizione (eng)</TableCell>
                                <TableCell>Url Immagine</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredientCategories.map((category) => (
                                <TableRow
                                    key={category.ing_category_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> 
                                    <TableCell component="th" scope="row">
                                        {category.ing_category_id}
                                    </TableCell>
                                    <TableCell>
                                        {category.name && category.name.it !== undefined  ? category.name.it : ''}
                                    </TableCell>
                                     <TableCell>
                                        {category.name && category.name.eng !== undefined  ? category.name.eng : ''}
                                    </TableCell>
                                    <TableCell>
                                        {category.description && category.description.it !== undefined  ? category.description.it : ''}
                                    </TableCell>
                                     <TableCell>
                                        {category.description && category.description.eng !== undefined  ? category.description.eng : ''}
                                    </TableCell>
                                     <TableCell>{category.illustration_url !== null ? category.illustration_url : "NULL"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                !loading && !error && <div>Nessuna Categoria Ingrediente trovata.</div>
            )}
        </Box>
    );
}

   
   