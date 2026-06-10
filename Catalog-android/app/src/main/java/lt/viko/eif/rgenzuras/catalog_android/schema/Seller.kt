package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class Seller(
    val id: Int,
    val name: String,
    val stores: List<SellerStore> = emptyList(),
    val reviews: List<SellerReview> = emptyList(),
    @SerializedName("stores_count") val storeCount: Int = 0
)
