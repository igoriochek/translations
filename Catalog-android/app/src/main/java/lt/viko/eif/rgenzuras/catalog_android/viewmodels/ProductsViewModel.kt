package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.paging.Pager
import androidx.paging.PagingConfig
import androidx.paging.PagingData
import androidx.paging.cachedIn
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.pagers.ProductPagingSource
import lt.viko.eif.rgenzuras.catalog_android.schema.Product
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductFilters
import lt.viko.eif.rgenzuras.catalog_android.schema.RelatedProduct

class ProductsViewModel(
    private val api: ApiService,
    private val token: String
) : ViewModel() {
    private final val perPage = 20

    private val _products = MutableStateFlow(updatePager())
    val products = _products.asStateFlow()

    private val _filters =
        MutableStateFlow(ProductFilters())

    val filters = _filters.asStateFlow()

    private fun updatePager(query: String? = null, categories: List<Int>? = null, allergens: List<Int>? = null): Flow<PagingData<RelatedProduct>> {
        return Pager(
            config = PagingConfig(
                pageSize = perPage,
                initialLoadSize = perPage,
                prefetchDistance = 5
            )
        ) {
            ProductPagingSource(api, token, query, categories, allergens)
        }
            .flow
            .cachedIn(viewModelScope)
    }

    fun applyFilters(
        query: String,
        categories: List<Int>,
        allergens: List<Int>
    ) {
        _filters.value = ProductFilters(
            query,
            categories,
            allergens
        )

        _products.value = updatePager(
            query,
            categories,
            allergens
        )
    }

    fun clearFilters() {
        _filters.value = ProductFilters()

        _products.value = updatePager()
    }

    suspend fun getProductByCode(code: String): Product {
        return api.getProductByCode("Bearer $token", code)
    }
}