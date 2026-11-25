package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.schema.Product

class ProductsViewModel(
    private val api: ApiService,
    private val token: String
) : ViewModel() {
    suspend fun getProductByCode(code: String): Product {
        return api.getProductByCode("Bearer $token", code)
    }

    suspend fun addSearchResult(productId: Int) {
        api.addScanResult("Bearer $token", productId)
    }
}