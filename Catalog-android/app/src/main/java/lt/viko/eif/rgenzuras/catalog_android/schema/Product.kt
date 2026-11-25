package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class Product(
    val id: Int,
    val manufacturer: Manufacturer,
    val sellers: List<SellerProduct>,
    @SerializedName("product_code") val productCode: String,
    val names: List<ProductName>,
    val descriptions: List<ProductDescription>,
    val categories: List<Category>,
    val certifications: List<Certification>,
    val ingredients: List<ProductIngredient>,
    @SerializedName("nutritional_measurements") val nutritionalMeasurements: List<NutritionalMeasurement>,
    @SerializedName("related_products") val relatedProducts: List<RelatedProduct>,
    val allergens: List<Allergen>,
    val images: List<ProductImage>,
    @SerializedName("usage_instructions") val usageInstructions: List<UsageInstruction>,
    val reviews: List<ProductReview>
)
