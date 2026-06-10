package lt.viko.eif.rgenzuras.catalog_android.components

import android.content.res.Configuration
import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.HideImage
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SuggestionChip
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.schema.Category
import lt.viko.eif.rgenzuras.catalog_android.schema.CategoryName
import lt.viko.eif.rgenzuras.catalog_android.schema.Language
import lt.viko.eif.rgenzuras.catalog_android.schema.Manufacturer
import lt.viko.eif.rgenzuras.catalog_android.schema.Product
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductImage
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductName
import lt.viko.eif.rgenzuras.catalog_android.schema.RelatedProduct
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel
import lt.viko.eif.rgenzuras.catalog_android.views.ProductScreen

@Composable
fun ProductCard(
    product: RelatedProduct,
    uiLanguage: LanguageViewModel.AppLanguage,
    contentLanguage: String
) {
    val names = product.names
    val categories = product.categories

    val productName = (names.firstOrNull { it.language.code == uiLanguage.code }
        ?: names.first { it.language.code == contentLanguage }).name

    Card(onClick = {
        backStack.add(ProductScreen(product.id))
    }) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(15.dp),
            verticalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(6f / 4f),
                shape = RoundedCornerShape(5.dp),
                shadowElevation = 2.dp
            ) {
                if (product.images.isEmpty())
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            Icons.Outlined.HideImage,
                            contentDescription = "No image",
                            modifier = Modifier.size(80.dp)
                        )
                    }
                else
                    AsyncImage(
                        product.images.first().imageUrl,
                        contentDescription = "Product image",
                        contentScale = ContentScale.Crop
                    )
            }

            Text(productName, style = MaterialTheme.typography.titleLarge)
            Text(
                product.manufacturer.name,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (categories.count() > 0)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    val takeCount = 2
                    val remainingCount = categories.count() - takeCount

                    categories.take(takeCount).forEach { category ->
                        val categoryNames = category.names

                        val categoryName =
                            (categoryNames.firstOrNull { it.language.code == uiLanguage.code }
                                ?: categoryNames.first { it.language.code == contentLanguage }).name

                        SuggestionChip({}, {
                            Text(categoryName, overflow = TextOverflow.Ellipsis, maxLines = 1)
                        }, Modifier.widthIn(max = 110.dp))
                    }

                    if (remainingCount > 0)
                        SuggestionChip({}, {
                            Text("+${remainingCount}")
                        }, modifier = Modifier.width(IntrinsicSize.Max))
                }
        }
    }
}

@Composable
@Preview(name = "Light Mode")
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    name = "Dark Mode"
)
fun ProductCardPreview() {
    val language = Language(0, "English", "en")

    CatalogAppTheme {
        Surface {
            Box(Modifier.padding(15.dp)) {
                ProductCard(
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
                    LanguageViewModel.AppLanguage.LITHUANIAN,
                    "en"
                )
            }
        }
    }
}