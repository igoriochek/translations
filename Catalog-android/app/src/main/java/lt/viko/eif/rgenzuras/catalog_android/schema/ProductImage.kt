package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class ProductImage(val id: Int, @SerializedName("image_url") val imageUrl: String)
