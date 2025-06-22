import { useApiCall } from "../../context/ApiContext"
import API_URL from "../../config/apiUrl";
import { useEffect, useState } from "react";
import { type CategoryValue, type CategoryValueApiResponse } from "../../types/ApiTypes";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography} from "@mui/material";   


export default function AdminCategoryValues(){

    const [lang, setLang] = useState<"it"|"eng">("it");

    const {apiCall, loading, error, result} = useApiCall();

    useEffect(()=> {
        apiCall(API_URL.CATEGORY_VALUES, "get");
    }, [apiCall])

     const categoryValues : CategoryValue[] = result && (result as CategoryValueApiResponse).categoryValues
                                                ? (result as CategoryValueApiResponse).categoryValues : [];
    
     return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Gestione Category Values</Typography>
            {loading && <div>Caricamento Risultati in Corso</div>}
            {error && <div>Errore: {error?.msg || "Si è verificato un errore."}</div>}
            {categoryValues.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="Tabella Ingredienti Amministrazione">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Categoria-Value</TableCell>
                                <TableCell>ID Categoria</TableCell>
                                <TableCell>Value (it)</TableCell>
                                <TableCell>Value (eng)</TableCell>
                                 <TableCell>Descrizione (it)</TableCell>
                                <TableCell>Descrizione (eng)</TableCell>
                                <TableCell>Slug Categoria-Value</TableCell>
                                <TableCell>Url Immagine</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categoryValues.map((category) => (
                                <TableRow
                                    key={category.category_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> 
                                    <TableCell component="th" scope="row">
                                        {category.category_value_id}
                                    </TableCell>
                                     <TableCell component="th" scope="row">
                                        {category.category_id}
                                    </TableCell>
                                    <TableCell>
                                        {category.value && category.value.it !== undefined  ? category.value.it : ''}
                                    </TableCell>
                                     <TableCell>
                                        {category.value && category.value.eng !== undefined  ? category.value.eng : ''}
                                    </TableCell>
                                    <TableCell>
                                        {category.description && category.description.it !== undefined  ? category.description.it : ''}
                                    </TableCell>
                                     <TableCell>
                                        {category.description && category.description.eng !== undefined  ? category.description.eng : ''}
                                    </TableCell>
                                    <TableCell>{category.category_value_slug}</TableCell>
                                     <TableCell>{category.illustration_url !== null ? category.illustration_url : "NULL"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                !loading && !error && <div>Nessuna Categoria Valore trovata.</div>
            )}
        </Box>
    );
}

   