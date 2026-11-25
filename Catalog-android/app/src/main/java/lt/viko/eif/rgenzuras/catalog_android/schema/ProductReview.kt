package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName
import java.time.Instant
import java.time.LocalDate
import java.util.Date

data class ProductReview(
    val id: Int,
    val user: User,
    val purchased: Boolean,
    val recommended: Boolean,
    val title: String,
    val content: String,
    val rating: Int,
    @SerializedName("created_at") val createdAt: Instant = Date(2026, 11, 25).toInstant()
)
