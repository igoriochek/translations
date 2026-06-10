package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.api.ReviewRequest
import lt.viko.eif.rgenzuras.catalog_android.schema.Seller

class SellerViewModel(
    private val api: ApiService, private val token: String
) : ViewModel() {

    private val _seller = MutableStateFlow<Seller?>(null)
    val seller = _seller.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading = _loading.asStateFlow()

    fun loadSeller(id: Int) {
        viewModelScope.launch {
            _loading.value = true

            _seller.value = api.getSeller(
                "Bearer $token", id
            )

            _loading.value = false
        }
    }

    fun createReview(sellerId: Int, title: String, content: String) {
        viewModelScope.launch {
            api.createSellerReview(
                "Bearer $token", sellerId, ReviewRequest(
                    title, content
                )
            )

            loadSeller(sellerId)
        }
    }

    fun updateReview(sellerId: Int, reviewId: Int, title: String, content: String) {
        viewModelScope.launch {
            api.updateSellerReview(
                "Bearer $token", reviewId, ReviewRequest(
                    title, content
                )
            )

            loadSeller(sellerId)
        }
    }

    fun deleteReview(sellerId: Int, reviewId: Int) {
        viewModelScope.launch {
            api.deleteSellerReview(
                "Bearer $token", reviewId
            )

            loadSeller(sellerId)
        }
    }
}