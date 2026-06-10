package lt.viko.eif.rgenzuras.catalog_android.schema

data class SellerProduct(val id: Int, val recommendations: List<RelatedProduct>, val seller: Seller)
