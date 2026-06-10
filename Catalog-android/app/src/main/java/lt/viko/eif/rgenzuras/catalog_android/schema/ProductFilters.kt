package lt.viko.eif.rgenzuras.catalog_android.schema

data class ProductFilters(
    val query: String = "",
    val categories: List<Int> = emptyList(),
    val allergens: List<Int> = emptyList()
)