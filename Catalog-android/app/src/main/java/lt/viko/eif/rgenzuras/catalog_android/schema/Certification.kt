package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class Certification(val id: Int, val label: String, @SerializedName("badge_url") val badgeUrl: String)
