package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.schema.Category

class CategoryViewModel(
    private val api: ApiService
) : ViewModel() {
    private val _categories = MutableStateFlow<List<Category>>(emptyList())
    val categories = _categories.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading = _loading.asStateFlow()

    fun loadCategories(token: String) {
        viewModelScope.launch {
            _loading.value = true

            _categories.value = api.getCategories("Bearer $token")

            _loading.value = false
        }
    }
}