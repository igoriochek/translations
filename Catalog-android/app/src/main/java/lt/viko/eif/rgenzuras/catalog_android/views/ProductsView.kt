package lt.viko.eif.rgenzuras.catalog_android.views

import android.content.res.Configuration
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.NavKey
import androidx.paging.LoadState
import androidx.paging.compose.collectAsLazyPagingItems
import androidx.paging.compose.itemKey
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.allergenViewModel
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.categoryViewModel
import lt.viko.eif.rgenzuras.catalog_android.components.ProductCard
import lt.viko.eif.rgenzuras.catalog_android.languageViewModel
import lt.viko.eif.rgenzuras.catalog_android.modals.ProductFiltersModalProps
import lt.viko.eif.rgenzuras.catalog_android.productsViewModel
import lt.viko.eif.rgenzuras.catalog_android.schema.Category
import lt.viko.eif.rgenzuras.catalog_android.schema.CategoryName
import lt.viko.eif.rgenzuras.catalog_android.schema.Language
import lt.viko.eif.rgenzuras.catalog_android.schema.Manufacturer
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductFilters
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductName
import lt.viko.eif.rgenzuras.catalog_android.schema.RelatedProduct
import lt.viko.eif.rgenzuras.catalog_android.scope
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel

@Serializable
data object ProductsScreen : NavKey

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Content(
    search: String,
    setSearch: (String) -> Unit,
    filters: ProductFilters = ProductFilters(),
    listState: LazyListState = rememberLazyListState(),
    refreshing: Boolean = false,
    onRefresh: () -> Unit = {},
    items: LazyListScope.() -> Unit
) {
    val showButton by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex > 5
        }
    }

    Surface {
        Scaffold { paddingValues ->
            Column(
                modifier = Modifier
                    .padding(paddingValues)
                    .padding(10.dp)
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        search,
                        setSearch,
                        placeholder = {
                            Text(localizedString(R.string.search_products))
                        },
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                Icons.Default.Search,
                                contentDescription = "Search icon",
                                modifier = Modifier.padding(start = 10.dp)
                            )
                        },
                        trailingIcon = {
                            Row(modifier = Modifier.padding(end = 6.dp)) {
                                AnimatedVisibility(search.isNotEmpty()) {
                                    IconButton({ setSearch("") }) {
                                        Icon(
                                            Icons.Default.Clear,
                                            contentDescription = "Clear search"
                                        )
                                    }
                                }
                                IconButton({
                                    backStack.add(BarcodeScannerScreen)
                                }) {
                                    Icon(
                                        Icons.Default.QrCodeScanner,
                                        contentDescription = "Search by barcode"
                                    )
                                }
                                IconButton({
                                    activeModal.value = ProductFiltersModalProps
                                }) {
                                    Icon(
                                        Icons.Default.FilterList,
                                        contentDescription = "Filter button",
                                        tint = if (filters.categories.isNotEmpty() || filters.allergens.isNotEmpty()) MaterialTheme.colorScheme.primary else LocalContentColor.current
                                    )
                                }
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(25.dp)
                    )

                    IconButton({
                        backStack.add(SettingsScreen)
                    }) {
                        Icon(
                            Icons.Default.Settings,
                            "Settings",
                            modifier = Modifier
                                .aspectRatio(1f)
                                .padding(horizontal = 6.dp)
                        )
                    }
                }

                Box {
                    PullToRefreshBox(refreshing, onRefresh, modifier = Modifier.fillMaxWidth()) {
                        LazyColumn(
                            state = listState,
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            items()
                        }
                    }

                    this@Column.AnimatedVisibility(
                        visible = showButton,
                        modifier = Modifier.align(Alignment.BottomEnd)
                    ) {
                        FloatingActionButton(
                            onClick = {
                                scope.launch {
                                    listState.animateScrollToItem(0)
                                }
                            }
                        ) {
                            Icon(
                                Icons.Default.KeyboardArrowUp,
                                contentDescription = null
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProductsMenu() {
    val categories by categoryViewModel.categories.collectAsState()
    val allergens by allergenViewModel.allergens.collectAsState()

    val _products by productsViewModel.products.collectAsState()
    val products = _products.collectAsLazyPagingItems()
    val filters by productsViewModel.filters.collectAsState()
    val uiLanguage by languageViewModel.appLanguage.collectAsState()
    val contentLanguage by languageViewModel.contentLanguage.collectAsState()
    val listState = rememberLazyListState()

    var search by remember { mutableStateOf("") }

    val appliedFilters = remember(filters, categories, allergens) {
        derivedStateOf {
            ProductFilters(
                filters.query,
                if (filters.categories.size == categories.size) emptyList() else filters.categories,
                if (filters.allergens.size == allergens.size) emptyList() else filters.allergens
            )
        }
    }

    Content(
        search = search,
        setSearch = {
            search = it
            productsViewModel.applyFilters(search, filters.categories, filters.allergens)
        },
        filters = appliedFilters.value,
        listState = listState,
        refreshing = products.loadState.refresh is LoadState.Loading,
        onRefresh = { products.refresh() }
    ) {
        items(products.itemCount, key = products.itemKey { it.id }) { index ->
            val product = products[index]

            if(product != null)
                ProductCard(product, uiLanguage, contentLanguage)
        }
    }
}

@Composable
@Preview(
    showSystemUi = true,
    device = "spec:width=1080px,height=2340px,dpi=400",
    name = "Light Mode"
)
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    showSystemUi = true,
    device = "spec:width=1080px,height=2340px,dpi=400",
    name = "Dark Mode"
)
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    showSystemUi = true,
    device = "spec:width=1080px,height=2340px,dpi=400",
    locale = "lt",
    name = "Lith"
)
fun ProductsPreview() {
    val language = Language(0, "English", "en")
    val products = listOf(
        RelatedProduct(
            0,
            Manufacturer(0, "Manufacturer", country = null),
            listOf(
                ProductName(0, "Product", language)
            ),
            listOf(
                Category(0, listOf(CategoryName(0, "Category 1", language))),
                Category(0, listOf(CategoryName(0, "Category 2", language))),
                Category(0, listOf(CategoryName(0, "Category 3", language))),
                Category(0, listOf(CategoryName(0, "Category 4", language)))
            ),
            emptyList()
        ),
        RelatedProduct(
            1,
            Manufacturer(0, "Manufacturer", country = null),
            listOf(
                ProductName(0, "Product", language)
            ),
            listOf(
                Category(0, listOf(CategoryName(0, "Category 1", language))),
                Category(0, listOf(CategoryName(0, "Category 2", language))),
                Category(0, listOf(CategoryName(0, "Category 3", language))),
                Category(0, listOf(CategoryName(0, "Category 4", language)))
            ),
            emptyList()
        ),
        RelatedProduct(
            2,
            Manufacturer(0, "Manufacturer", country = null),
            listOf(
                ProductName(0, "Product", language)
            ),
            listOf(
                Category(0, listOf(CategoryName(0, "Category 1", language))),
                Category(0, listOf(CategoryName(0, "Category 2", language))),
                Category(0, listOf(CategoryName(0, "Category 3", language))),
                Category(0, listOf(CategoryName(0, "Category 4", language)))
            ),
            emptyList()
        )
    )

    CatalogAppTheme {
        Content("", {}) {
            items(items = products, key = { it.id }) { product ->
                ProductCard(product, LanguageViewModel.AppLanguage.ENGLISH, "en")
            }
        }
    }
}