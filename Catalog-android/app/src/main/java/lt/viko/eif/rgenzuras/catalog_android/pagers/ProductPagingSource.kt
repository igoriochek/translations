package lt.viko.eif.rgenzuras.catalog_android.pagers

import android.util.Log
import androidx.paging.PagingSource
import androidx.paging.PagingState
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.schema.Product
import lt.viko.eif.rgenzuras.catalog_android.schema.RelatedProduct

class ProductPagingSource(
    private val api: ApiService,
    private val token: String,
    private val name: String?,
    private val categories: List<Int>?,
    private val allergens: List<Int>?
) : PagingSource<Int, RelatedProduct>() {
    override suspend fun load(
        params: LoadParams<Int>
    ): LoadResult<Int, RelatedProduct> {
        return try {
            val page = params.key ?: 1

            val response = api.getProducts(
                token = "Bearer $token",
                page = page,
                perPage = params.loadSize,
                name,
                categories,
                allergens
            )

            LoadResult.Page(
                data = response.data,
                prevKey = if (page == 1) null else page - 1,
                nextKey = if (page >= response.lastPage) null else page + 1
            )

        } catch (e: Exception) {
            Log.e("Paging", "Error", e)
            LoadResult.Error(e)
        }
    }

    override fun getRefreshKey(
        state: PagingState<Int, RelatedProduct>
    ): Int? {
        return state.anchorPosition?.let { position ->
            state.closestPageToPosition(position)?.prevKey?.plus(1)
                ?: state.closestPageToPosition(position)?.nextKey?.minus(1)
        }
    }
}