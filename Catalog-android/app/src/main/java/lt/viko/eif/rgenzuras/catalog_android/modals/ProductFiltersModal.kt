package lt.viko.eif.rgenzuras.catalog_android.modals

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.allergenViewModel
import lt.viko.eif.rgenzuras.catalog_android.categoryViewModel
import lt.viko.eif.rgenzuras.catalog_android.productsViewModel
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.userViewModel
import lt.viko.eif.rgenzuras.catalog_android.views.ProductsPreview

@Composable
fun ProductFiltersModal() {
    val categories by categoryViewModel.categories.collectAsState()
    val allergens by allergenViewModel.allergens.collectAsState()
    val filters by productsViewModel.filters.collectAsState()
    val token by userViewModel.token.collectAsState()

    val categoriesLoading by categoryViewModel.loading.collectAsState()
    val allergensLoading by allergenViewModel.loading.collectAsState()

    var selectedCategories by remember(filters) {
        mutableStateOf(filters.categories.toSet())
    }

    var selectedAllergens by remember(filters) {
        mutableStateOf(filters.allergens.toSet())
    }

    LaunchedEffect(Unit) {
        categoryViewModel.loadCategories(token!!)
        allergenViewModel.loadAllergens(token!!)
    }

    LaunchedEffect(selectedCategories) {
        if(selectedCategories.isEmpty() && categories.isNotEmpty())
            selectedCategories = selectedCategories + categories.first().id
    }

    LaunchedEffect(selectedAllergens) {
        if(selectedAllergens.isEmpty() && allergens.isNotEmpty())
            selectedAllergens = selectedAllergens + allergens.first().id
    }

    AppModal(
        title = "Filters", onDismiss = {
            activeModal.value = null
        }) {
        Text(
            "Categories", style = MaterialTheme.typography.titleMedium
        )

        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            val allSelected = selectedCategories.size == categories.size

            Checkbox(
                checked = allSelected, onCheckedChange = { checked ->
                    selectedCategories = if (checked) categories.map { it.id }.toSet()
                    else emptySet()
                })

            Text("All Categories")
        }

        if (!categoriesLoading)
            LazyColumn(modifier = Modifier.heightIn(max = 400.dp).fillMaxWidth()) {
                items(categories) { category ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = category.id in selectedCategories,
                            onCheckedChange = { checked ->
                                selectedCategories = if (checked) selectedCategories + category.id
                                else selectedCategories - category.id
                            })

                        Text(category.names.first().name)
                    }
                }
            }
        else
            Box(Modifier.fillMaxWidth()) {
                CircularProgressIndicator(
                    modifier = Modifier
                        .size(30.dp)
                        .align(Alignment.Center)
                )
            }

        HorizontalDivider()

        Text(
            "Allergens", style = MaterialTheme.typography.titleMedium
        )

        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = selectedAllergens.size == allergens.size, onCheckedChange = { checked ->
                    selectedAllergens = if (checked) allergens.map { it.id }.toSet()
                    else emptySet()
                })

            Text("All Allergens")
        }

        if (!allergensLoading)
            LazyColumn(modifier = Modifier.heightIn(max = 400.dp).fillMaxWidth()) {
                items(allergens) { allergen ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = allergen.id in selectedAllergens,
                            onCheckedChange = { checked ->
                                selectedAllergens = if (checked) selectedAllergens + allergen.id
                                else selectedAllergens - allergen.id
                            })

                        Text(allergen.names.first().name)
                    }
                }
            }
        else
            Box(Modifier.fillMaxWidth()) {
                CircularProgressIndicator(
                    modifier = Modifier
                        .size(30.dp)
                        .align(Alignment.Center)
                )
            }

        HorizontalDivider()

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = {

                    val categoryFilter =
                        if (selectedCategories.isEmpty() || selectedCategories.size == categories.size) categories.map { it.id }
                        else selectedCategories.toList()

                    val allergenFilter =
                        if (selectedAllergens.isEmpty() || selectedAllergens.size == allergens.size) allergens.map { it.id }
                        else selectedAllergens.toList()

                    productsViewModel.applyFilters(
                        query = filters.query,
                        categories = categoryFilter,
                        allergens = allergenFilter
                    )

                    activeModal.value = null
                }) {
                Text("Apply")
            }

            OutlinedButton(
                onClick = {
                    productsViewModel.applyFilters(filters.query, categories.map { it.id }, allergens.map { it.id })

                    activeModal.value = null
                }) {
                Text("Clear")
            }
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
private fun ProductFiltersPreview() {
    CatalogAppTheme {
        Surface {
            Box {
                ProductsPreview()
                ProductFiltersModal()
            }
        }
    }
}