package lt.viko.eif.rgenzuras.catalog_android.schema

data class Recipe(val names: List<RecipeName>, val contents: List<RecipeContent>, val products: List<RelatedProduct>)
