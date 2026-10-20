package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName
import java.time.Instant

data class ScanHistory(val id: Int, val product: RelatedProduct, @SerializedName("created_at") val createdAt: Instant)
