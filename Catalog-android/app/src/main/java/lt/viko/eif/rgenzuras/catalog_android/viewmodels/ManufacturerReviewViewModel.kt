package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.api.ReviewRequest
import lt.viko.eif.rgenzuras.catalog_android.schema.ManufacturerReview

class ManufacturerReviewViewModel(
    private val api: ApiService,
    private val token: String
) : ViewModel() {

    private val _reviews =
        MutableStateFlow<List<ManufacturerReview>>(
            emptyList()
        )

    val reviews = _reviews.asStateFlow()

    fun loadReviews(
        manufacturerId: Int
    ) {
        viewModelScope.launch {

            _reviews.value =
                api.getManufacturerReviews(
                    "Bearer $token",
                    manufacturerId
                )
        }
    }

    fun createReview(
        manufacturerId: Int,
        title: String,
        content: String
    ) {
        viewModelScope.launch {

            api.createManufacturerReview(
                "Bearer $token",
                manufacturerId,
                ReviewRequest(title, content)
            )

            loadReviews(manufacturerId)
        }
    }

    fun updateReview(
        reviewId: Int,
        title: String,
        content: String
    ) {
        viewModelScope.launch {

            api.updateManufacturerReview(
                "Bearer $token",
                reviewId,
                ReviewRequest(title, content)
            )
        }
    }

    fun deleteReview(
        reviewId: Int
    ) {
        viewModelScope.launch {

            api.deleteManufacturerReview(
                "Bearer $token",
                reviewId
            )
        }
    }
}