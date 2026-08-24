package lt.viko.eif.rgenzuras.catalog_android.views

import android.content.res.Configuration
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material3.AssistChip
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SuggestionChip
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.components.ImageCarousel
import lt.viko.eif.rgenzuras.catalog_android.components.KeyValueDisplay
import lt.viko.eif.rgenzuras.catalog_android.components.LabeledSection
import lt.viko.eif.rgenzuras.catalog_android.components.RelatedProductCard
import lt.viko.eif.rgenzuras.catalog_android.languageViewModel
import lt.viko.eif.rgenzuras.catalog_android.modals.ManufacturerModalProps
import lt.viko.eif.rgenzuras.catalog_android.modals.RecipeModalProps
import lt.viko.eif.rgenzuras.catalog_android.modals.SellerModalProps
import lt.viko.eif.rgenzuras.catalog_android.productViewModel
import lt.viko.eif.rgenzuras.catalog_android.recipeViewModel
import lt.viko.eif.rgenzuras.catalog_android.schema.Allergen
import lt.viko.eif.rgenzuras.catalog_android.schema.AllergenName
import lt.viko.eif.rgenzuras.catalog_android.schema.Category
import lt.viko.eif.rgenzuras.catalog_android.schema.CategoryName
import lt.viko.eif.rgenzuras.catalog_android.schema.Ingredient
import lt.viko.eif.rgenzuras.catalog_android.schema.IngredientName
import lt.viko.eif.rgenzuras.catalog_android.schema.Language
import lt.viko.eif.rgenzuras.catalog_android.schema.Manufacturer
import lt.viko.eif.rgenzuras.catalog_android.schema.MeasurementUnitType
import lt.viko.eif.rgenzuras.catalog_android.schema.NutritionalMeasurement
import lt.viko.eif.rgenzuras.catalog_android.schema.NutritionalType
import lt.viko.eif.rgenzuras.catalog_android.schema.NutritionalTypeLabel
import lt.viko.eif.rgenzuras.catalog_android.schema.Product
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductImage
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductIngredient
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductName
import lt.viko.eif.rgenzuras.catalog_android.schema.Recipe
import lt.viko.eif.rgenzuras.catalog_android.schema.RelatedProduct
import lt.viko.eif.rgenzuras.catalog_android.schema.Seller
import lt.viko.eif.rgenzuras.catalog_android.schema.SellerProduct
import lt.viko.eif.rgenzuras.catalog_android.schema.UsageInstruction
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.MeasurementFormatter
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.userViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel

@Serializable
data class ProductScreen(val productId: Int) : NavKey

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Content(
    product: Product,
    recipes: List<Recipe> = emptyList(),
    uiLanguage: LanguageViewModel.AppLanguage = LanguageViewModel.AppLanguage.ENGLISH,
    contentLanguage: String = "en",
    loading: Boolean = false,
    onRefresh: () -> Unit = {},
    onRemove: () -> Unit = {}
) {
    val listState = rememberLazyListState()
    val imageHeight = 225.dp

    val density = LocalDensity.current

    val imageHeightPx = with(density) { imageHeight.toPx() }

    val scrollProgress by remember {
        derivedStateOf {
            when {
                listState.firstVisibleItemIndex > 0 -> 1f
                else -> {
                    (listState.firstVisibleItemScrollOffset / imageHeightPx)
                        .coerceIn(.5f, 1f)
                }
            }
        }
    }

    val sellers = product.sellers
    val names = product.names
    val categories = product.categories
    val allergens = product.allergens
    val ingredients = product.ingredients
    val nutritionalMeasurements = product.nutritionalMeasurements
    val relatedProducts = product.relatedProducts
    val recommendations = product.sellers.flatMap { it.recommendations }

    val productName = (names.firstOrNull { it.language.code == uiLanguage.code }
        ?: names.first { it.language.code == contentLanguage }).name

    val padding = Modifier.padding(horizontal = 15.dp)

    var columnModifier = Modifier
        .fillMaxSize()
        .navigationBarsPadding()
    if (product.images.isEmpty()) columnModifier = columnModifier.statusBarsPadding()

    Box(Modifier.fillMaxSize()) {
        PullToRefreshBox(
            loading, onRefresh, modifier = columnModifier
        ) {
            LazyColumn(
                state = listState, verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (product.images.isNotEmpty()) item {
                    ImageCarousel(
                        product.images.map { it.imageUrl }, modifier = Modifier.height(imageHeight + 75.dp)
                    )
                }
                else item {
                    Spacer(Modifier.height(40.dp))
                }

                item {
                    LabeledSection(localizedString(R.string.manufacturer), padding) {
                        AssistChip({
                            activeModal.value = ManufacturerModalProps(product.manufacturer)
                        }, {
                            Text(product.manufacturer.name)
                        })
                    }
                }

                item {
                    LabeledSection(localizedString(R.string.sellers), padding) {
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            if (sellers.isEmpty()) item {
                                Text(localizedString(R.string.currently_unavailable))
                            }

                            items(sellers) { seller ->

                                AssistChip({
                                    activeModal.value = SellerModalProps(seller.seller.id)
                                }, {
                                    Column(Modifier.padding(5.dp)) {
                                        Text(
                                            seller.seller.name,
                                            style = MaterialTheme.typography.labelLarge
                                        )

                                        Text(
                                            "${seller.seller.storeCount} ${localizedString(R.string.stores)}",
                                            style = MaterialTheme.typography.labelMedium
                                        )
                                    }
                                })
                            }
                        }
                    }
                }

                if (recipes.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.recipes), padding) {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            items(recipes) { recipe ->
                                SuggestionChip(onClick = {
                                    activeModal.value =
                                        RecipeModalProps(recipe, uiLanguage, contentLanguage)
                                }, label = {
                                    Text(
                                        recipe.names.first().name
                                    )
                                })
                            }
                        }
                    }
                }

                if (categories.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.categories), padding) {
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(categories) { category ->
                                val categoryName =
                                    (category.names.firstOrNull { it.language.code == uiLanguage.code }
                                        ?: category.names.first { it.language.code == contentLanguage }).name

                                OutlinedCard(shape = RoundedCornerShape(5.dp)) {
                                    Text(
                                        categoryName,
                                        Modifier.padding(10.dp, 5.dp),
                                        style = MaterialTheme.typography.labelLarge
                                    )
                                }
                            }
                        }
                    }
                }

                if (allergens.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.allergens), padding) {
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(allergens) { allergen ->
                                val allergenName =
                                    (allergen.names.firstOrNull { it.language.code == uiLanguage.code }
                                        ?: allergen.names.first { it.language.code == contentLanguage }).name

                                OutlinedCard(shape = RoundedCornerShape(5.dp)) {
                                    Text(
                                        allergenName,
                                        Modifier.padding(10.dp, 5.dp),
                                        style = MaterialTheme.typography.labelLarge
                                    )
                                }
                            }
                        }
                    }
                }

                if (ingredients.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.ingredients), padding) {
                        ingredients.forEach { ingredient ->
                            val measurement = MeasurementFormatter.format(
                                ingredient.amount,
                                ingredient.unitType
                            )

                            val ingredientName =
                                (ingredient.ingredient.names.firstOrNull { it.language.code == uiLanguage.code }
                                    ?: ingredient.ingredient.names.first { it.language.code == contentLanguage }).name

                            KeyValueDisplay(ingredientName, "${measurement.value} ${measurement.unit}")
                        }
                    }
                }

                if (nutritionalMeasurements.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.nutrition_facts), padding) {
                        nutritionalMeasurements.forEach { nutritionalMeasurement ->
                            val measurement = MeasurementFormatter.format(
                                nutritionalMeasurement.amount,
                                nutritionalMeasurement.unitType
                            )

                            val label =
                                (nutritionalMeasurement.type.labels.firstOrNull { it.language.code == uiLanguage.code }
                                    ?: nutritionalMeasurement.type.labels.first { it.language.code == contentLanguage }).label

                            KeyValueDisplay(label, "${measurement.value} ${measurement.unit}")
                        }
                    }
                }

                if (product.usageInstructions.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.usage_instructions), padding) {
                        val instruction = product.usageInstructions.firstOrNull {
                            it.language.code == uiLanguage.code
                        } ?: product.usageInstructions.firstOrNull {
                            it.language.code == contentLanguage
                        } ?: product.usageInstructions.first()

                        Text(instruction.content)
                    }
                }

                if (relatedProducts.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.related_products), padding) {
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(relatedProducts) { relatedProduct ->
                                val name =
                                    (relatedProduct.names.firstOrNull { it.language.code == uiLanguage.code }
                                        ?: relatedProduct.names.first { it.language.code == contentLanguage }).name
                                val categoryNames = relatedProduct.categories.map { name ->
                                    (name.names.firstOrNull { it.language.code == uiLanguage.code }
                                        ?: name.names.first { it.language.code == contentLanguage }).name
                                }
                                val imageUrl = relatedProduct.images.firstOrNull()?.imageUrl

                                RelatedProductCard(
                                    name, categoryNames, imageUrl, {
                                        backStack.add(ProductScreen(relatedProduct.id))
                                    })
                            }
                        }
                    }
                }

                if (recommendations.isNotEmpty()) item {
                    LabeledSection(localizedString(R.string.recommended), padding) {
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(recommendations) { recommendation ->
                                val name =
                                    (recommendation.names.firstOrNull { it.language.code == uiLanguage.code }
                                        ?: recommendation.names.first { it.language.code == contentLanguage }).name
                                val categoryNames = recommendation.categories.map { name ->
                                    (name.names.firstOrNull { it.language.code == uiLanguage.code }
                                        ?: name.names.first { it.language.code == contentLanguage }).name
                                }
                                val imageUrl = recommendation.images.firstOrNull()?.imageUrl

                                RelatedProductCard(
                                    name, categoryNames, imageUrl, {
                                        backStack.add(ProductScreen(recommendation.id))
                                    })
                            }
                        }
                    }
                }
            }
        }
        ProductHeader(
            productName,
            if (product.images.isEmpty()) 1f else scrollProgress,
            onRemove,
            Modifier.fillMaxWidth()
        )
    }
}

@Composable
fun ProductMenu(productScreen: ProductScreen) {
    val productId = productScreen.productId

    val uiLanguage by languageViewModel.appLanguage.collectAsState()
    val contentLanguage by languageViewModel.contentLanguage.collectAsState()

    val token by userViewModel.token.collectAsState()
    val product by productViewModel.product.collectAsState()
    val recipes by recipeViewModel.recipes.collectAsState()
    val loading by productViewModel.loading.collectAsState()

    val onRemove: () -> Unit = {
        backStack.remove(productScreen)
    }

    LaunchedEffect(productId) {
        productViewModel.loadProduct(productId, token!!)
        recipeViewModel.loadRecipes(productId)
    }

    Surface {
        if (product == null || productId != product!!.id) {
            Scaffold(topBar = {
                ProductHeader(
                    "", 1f, onRemove, Modifier.fillMaxWidth(), true
                )
            }) { padding ->
                Box(
                    Modifier
                        .fillMaxSize()
                        .padding(padding)
                ) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
            }

        } else Content(
            product!!,
            recipes,
            uiLanguage,
            contentLanguage,
            loading,
            { productViewModel.loadProduct(productId, token!!) },
            onRemove
        )
    }
}

@Composable
private fun ProductHeader(
    title: String,
    scrollProgress: Float,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
    loading: Boolean = false
) {
    Surface(
        modifier, color = MaterialTheme.colorScheme.surface.copy(alpha = scrollProgress)
    ) {
        Row(Modifier.statusBarsPadding(), verticalAlignment = Alignment.CenterVertically) {
            IconButton(
                onClick = onBack
            ) {
                Icon(
                    Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back"
                )
            }

            Spacer(Modifier.width(4.dp))

            if (loading) Box(
                modifier = Modifier
                    .fillMaxWidth(0.3f)
                    .height(16.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(
                        MaterialTheme.colorScheme.surfaceVariant
                    )
            )
            else Text(
                text = title, style = MaterialTheme.typography.titleLarge
            )
        }
    }
}

@Composable
@Preview(
    showSystemUi = true, device = "spec:width=1080px,height=2340px,dpi=400", name = "Light Mode"
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
private fun ProductPreview() {
    val language = Language(0, "English", "en")
    val unitType1 = MeasurementUnitType(0, "mass")
    val unitType2 = MeasurementUnitType(1, "volume")
    val ingredient1 = Ingredient(0, listOf(IngredientName(0, "Ingredient 1", language)))
    val ingredient2 = Ingredient(0, listOf(IngredientName(0, "Ingredient 2", language)))
    val nutritionalType1 = NutritionalType(0, listOf(NutritionalTypeLabel(0, "Type 1", language)))
    val nutritionalType2 = NutritionalType(0, listOf(NutritionalTypeLabel(0, "Type 2", language)))

    val recommendedProduct = RelatedProduct(
        0, Manufacturer(0, "Manufacturer", country = null), listOf(
            ProductName(0, "Recommended product", language)
        ), listOf(
            Category(0, listOf(CategoryName(0, "Category 1", language))),
            Category(0, listOf(CategoryName(0, "Category 2", language))),
            Category(0, listOf(CategoryName(0, "Category 3", language))),
            Category(0, listOf(CategoryName(0, "Category 4", language)))
        ), emptyList()
    )

    val product = Product(
        0, Manufacturer(0, "Manufacturer", country = null), listOf(
            SellerProduct(0, emptyList(), Seller(0, "Seller", storeCount = 0)),
            SellerProduct(0, listOf(recommendedProduct), Seller(0, "Seller", storeCount = 0))
        ), "PROD_QASLGJEO", listOf(
            ProductName(0, "Product", language)
        ), listOf(
            Category(0, listOf(CategoryName(0, "Category 1", language))),
            Category(0, listOf(CategoryName(0, "Category 2", language))),
            Category(0, listOf(CategoryName(0, "Category 3", language))),
            Category(0, listOf(CategoryName(0, "Category 4", language)))
        ), listOf(
            ProductIngredient(0, ingredient1, unitType1, 100f),
            ProductIngredient(0, ingredient2, unitType2, 443.602943f)
        ), listOf(
            NutritionalMeasurement(0, 50.2f, nutritionalType1, unitType1),
            NutritionalMeasurement(0, 10.47f, nutritionalType2, unitType2)
        ), listOf(recommendedProduct), listOf(
            Allergen(0, listOf(AllergenName(0, "Allergen 1", language))),
            Allergen(0, listOf(AllergenName(0, "Allergen 2", language))),
            Allergen(0, listOf(AllergenName(0, "Allergen 3", language))),
            Allergen(0, listOf(AllergenName(0, "Allergen 4", language)))
        ), listOf(
            ProductImage(0, ""), ProductImage(0, "")
        ),
        listOf(
            UsageInstruction(0, "Instruction", language)
        )
    )

    CatalogAppTheme {
        Surface {
            Content(product)
        }
    }
}