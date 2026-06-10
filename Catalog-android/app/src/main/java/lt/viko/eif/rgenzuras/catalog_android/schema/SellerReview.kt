package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class SellerReview(
    val id: Int,
    val user: User,
    @SerializedName("seller_id")
    val sellerId: Int,
    val title: String,
    val content: String
)