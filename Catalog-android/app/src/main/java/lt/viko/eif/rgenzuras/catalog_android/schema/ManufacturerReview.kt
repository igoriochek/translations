package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class ManufacturerReview(
    val id: Int,
    val user: User,
    @SerializedName("manufacturer_id") val manufacturerId: Int,
    val title: String,
    val content: String
)
