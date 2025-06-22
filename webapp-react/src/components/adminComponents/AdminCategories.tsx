import { useApiCall } from "../../context/ApiContext"
import API_URL from "../../config/apiUrl";
import { useEffect, useState } from "react";
import { type Category, type CategoriesApiResponse } from "../../types/ApiTypes";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography} from "@mui/material";      



export default function AdminCategories(){

    const [lang, setLang] = useState<"it"|"eng">("it");

    const {apiCall, loading, error, result} = useApiCall();

    useEffect(()=> {
        apiCall(API_URL.CATEGORIES, "get");
    }, [apiCall])

     const categories : Category[] = result && (result as CategoriesApiResponse).categories 
                                        ? (result as CategoriesApiResponse).categories : []
    
   
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Gestione Categorie</Typography>
            {loading && <div>Caricamento Risultati in Corso</div>}
            {error && <div>Errore: {error?.msg || "Si è verificato un errore."}</div>}
            {categories.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="Tabella Ingredienti Amministrazione">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Categoria</TableCell>
                                <TableCell>Nome (it)</TableCell>
                                <TableCell>Nome (eng)</TableCell>
                                 <TableCell>Descrizione (it)</TableCell>
                                <TableCell>Descrizione (eng)</TableCell>
                                <TableCell>Slug Categoria</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow
                                    key={category.category_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> 
                                    <TableCell component="th" scope="row">
                                        {category.category_id}
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
                                    <TableCell>{category.category_slug}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                !loading && !error && <div>Nessuna Categoria trovata.</div>
            )}
        </Box>
    );
}