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
   
interface IngCategory { 
        ing_category_id: number,
        name: {
            it: string,
            eng: string
        },
        description: {
            it: string,
            eng: string
        },
        illustration_url: string | null
    }

interface IngCategoriesApiResponse {
    ingredientCategories: IngCategory[];
    msg: string;
}


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

interface CategoriesApiResponse {
    categories: Category[];
    msg: string;
}

interface CategoryValue {
        category_value_id: number
        category_id: number,
        value: {
            it: string,
            eng: string
        },
        description: {
            it: string,
            eng: string
        },
        category_value_slug: string,
        illustration_url: string | null
    }

interface CategoryValueApiResponse {
    categoryValues: CategoryValue[];
    msg: string;
}
   
   


export {
    type IngCategory,
    type IngCategoriesApiResponse,
    type Ingredient,
    type IngredientsApiResponse,
    type Category,
    type CategoriesApiResponse,
    type CategoryValue,
    type CategoryValueApiResponse
}