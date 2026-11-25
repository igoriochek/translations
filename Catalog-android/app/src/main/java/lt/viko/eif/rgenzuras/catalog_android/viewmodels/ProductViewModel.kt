package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.api.ProductReviewRequest
import lt.viko.eif.rgenzuras.catalog_android.productViewModel
import lt.viko.eif.rgenzuras.catalog_android.schema.Product

class ProductViewModel(
    private val api: ApiService
): ViewModel() {
    private val _product = MutableStateFlow<Product?>(null)
    val product = _product.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading = _loading.asStateFlow()

    private val _reviewLoading = MutableStateFlow(false)
    val reviewLoading = _reviewLoading.asStateFlow()

    fun loadProduct(productId: Int, token: String) {
        viewModelScope.launch {
            _loading.value = true

            _product.value = api.getProduct("Bearer $token", productId)

            _loading.value = false
        }
    }

    fun createReview(token: String, productId: Int, review: ProductReviewRequest) {
        viewModelScope.launch {
            _reviewLoading.value = true
            api.createProductReview("Bearer $token", productId, review)
            _product.value = api.getProduct("Bearer $token", productId)
            _reviewLoading.value = false
        }
    }

    fun updateReview(token: String, reviewId: Int, review: ProductReviewRequest) {
        viewModelScope.launch {
            _reviewLoading.value = true
            api.updateProductReview("Bearer $token", reviewId, review)
            _product.value = api.getProduct("Bearer $token", _product.value!!.id)
            _reviewLoading.value = false
        }
    }

    fun deleteReview(token: String, reviewId: Int) {
        viewModelScope.launch {
            _reviewLoading.value = true
            api.deleteProductReview("Bearer $token", reviewId)
            _product.value = api.getProduct("Bearer $token", _product.value!!.id)
            _reviewLoading.value = false
        }
    }
}