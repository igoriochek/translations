package lt.viko.eif.rgenzuras.catalog_android.schema

data class RelatedProduct(
    val id: Int,
    val manufacturer: Manufacturer,
    val names: List<ProductName>,
    val categories: List<Category>,
    val images: List<ProductImage>
)
