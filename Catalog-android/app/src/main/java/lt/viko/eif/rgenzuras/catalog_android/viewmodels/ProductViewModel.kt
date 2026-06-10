package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.schema.Product

class ProductViewModel(
    private val api: ApiService
): ViewModel() {
    private val _product = MutableStateFlow<Product?>(null)
    val product = _product.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    fun loadProduct(productId: Int, token: String) {
        viewModelScope.launch {
            _loading.value = true

            _product.value = api.getProduct("Bearer $token", productId)

            _loading.value = false
        }
    }
}