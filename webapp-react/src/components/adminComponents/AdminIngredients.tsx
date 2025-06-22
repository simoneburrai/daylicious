import { useApiCall } from "../../context/ApiContext"
import API_URL from "../../config/apiUrl";
import { useEffect, useState } from "react";
import { type Ingredient, type IngredientsApiResponse } from "../../types/ApiTypes";
import {
  Box,
  Table,          // Il container principale della tabella
  TableBody,      // Il corpo della tabella (le righe dei dati)
  TableCell,      // Le singole celle della tabella
  TableContainer, // Un wrapper per la tabella, utile per lo scroll e l'ombra
  TableHead,      // L'intestazione della tabella (le colonne)
  TableRow,       // Una singola riga della tabella
  Paper,          // Un componente di "carta" per dare un'ombra e uno sfondo alla tabella
  Typography      // Per i titoli o il testo (opzionale, ma utile per il contesto)
} from "@mui/material";



export default function AdminIngredients(){


     const [viewFormNewIngredient, setViewFormNewIngredient] = useState(false);
    const {apiCall, loading, error, result} = useApiCall();
    const [formData, setFormData] = useState({
        ing_category_id: 0,
        name: {
            "it": "",
            "eng": ""
        },
        illustration_url: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: name === "ing_category_id" ? Number(value) : value
        }));
    };

     function handleNestedInputChange(e: React.ChangeEvent<HTMLInputElement>) {
       const { name, value } = e.target; // name sarà "it" o "eng"
        setFormData(prevFormData => ({
            ...prevFormData,
            name: {
                ...prevFormData.name, // Copia l'oggetto name esistente
                [name]: value,      // Aggiorna la proprietà specifica ("it" o "eng")
            },
        }));
    }

    function handleSubmitCreation(e: React.FormEvent){
        e.preventDefault();
        console.log(formData)
        apiCall(API_URL.INGREDIENTS, "post", formData)
    }

    useEffect(()=> {
        apiCall(API_URL.INGREDIENTS, "get");
    }, [apiCall])

    const ingredients : Ingredient[] = result && (result as IngredientsApiResponse).ingredients
        ? (result as IngredientsApiResponse).ingredients
        : []
    

   return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Gestione Ingredienti</Typography>
            <button onClick={()=>setViewFormNewIngredient(prev => !prev)}>Crea Nuovo Ingrediente</button>
            {viewFormNewIngredient && <form onSubmit={handleSubmitCreation}>
                    <input type="number" placeholder="Ingredient Category ID" value={formData.ing_category_id} onChange={handleInputChange} name="ing_category_id" />
                    <input type="text" placeholder="Ingredient Italian Name" value={formData.name.it} onChange={handleNestedInputChange}  name="it" />
                    <input type="text" placeholder="Ingredient English Name"  value={formData.name.eng} onChange={handleNestedInputChange}  name="eng"/>
                    <input type="text" placeholder="Illustration Url" value={formData.illustration_url} onChange={handleInputChange}  name="illustration_url" />
                    <button type="submit">Crea</button>
                </form>}
            {loading && <div>Caricamento Risultati in Corso</div>}
            {error && <div>Errore: {error?.msg || "Si è verificato un errore."}</div>}
            {ingredients.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="Tabella Ingredienti Amministrazione">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Ingrediente</TableCell>
                                <TableCell>Nome (it)</TableCell>
                                <TableCell>Nome (eng)</TableCell>
                                <TableCell align="right">ID Categoria Ingrediente</TableCell>
                                <TableCell>Slug Ingrediente</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredients.map((ingredient) => (
                                <TableRow
                                    key={ingredient.ingredient_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> 
                                    <TableCell component="th" scope="row">
                                        {ingredient.ingredient_id}
                                    </TableCell>
                                    <TableCell>
                                        {ingredient.name && ingredient.name.it !== undefined  ? ingredient.name.it : ''}
                                    </TableCell>
                                     <TableCell>
                                        {ingredient.name && ingredient.name.eng !== undefined  ? ingredient.name.eng : ''}
                                    </TableCell>
                                    <TableCell align="right">{ingredient.ing_category_id}</TableCell>
                                    <TableCell>{ingredient.ingredient_slug}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                !loading && !error && <div>Nessun ingrediente trovato.</div>
            )}
        </Box>
    );
}