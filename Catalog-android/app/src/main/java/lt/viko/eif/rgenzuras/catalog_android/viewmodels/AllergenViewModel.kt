package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.schema.Allergen
import lt.viko.eif.rgenzuras.catalog_android.schema.Category

class AllergenViewModel(
    private val api: ApiService
) : ViewModel() {
    private val _allergens = MutableStateFlow<List<Allergen>>(emptyList())
    val allergens = _allergens.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading = _loading.asStateFlow()

    fun loadAllergens(token: String) {
        viewModelScope.launch {
            _loading.value = true

            _allergens.value = api.getAllergens("Bearer $token")

            _loading.value = false
        }
    }
}