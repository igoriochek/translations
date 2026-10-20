package lt.viko.eif.rgenzuras.catalog_android.components

import android.content.res.Configuration
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import lt.viko.eif.rgenzuras.catalog_android.schema.Category
import lt.viko.eif.rgenzuras.catalog_android.schema.CategoryName
import lt.viko.eif.rgenzuras.catalog_android.schema.Language
import lt.viko.eif.rgenzuras.catalog_android.schema.Manufacturer
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductName
import lt.viko.eif.rgenzuras.catalog_android.schema.RelatedProduct
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel

@Composable
fun RelatedProductCard(name: String, categories: List<String>, modifier: Modifier = Modifier, imageUrl: String? = null, onClick: () -> Unit = {}) {
    Card(modifier = modifier.clickable(onClick = onClick)) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Surface(
                modifier = Modifier
                    .widthIn(min = 60.dp)
                    .weight(1f)
                    .aspectRatio(4f / 3f),
                shape = RoundedCornerShape(5.dp),
                tonalElevation = 1.dp,
                shadowElevation = 2.dp
            ) {
                if(imageUrl == null)
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            Icons.Outlined.HideImage,
                            contentDescription = "No image"
                        )
                    }
                else
                    AsyncImage(
                        imageUrl,
                        contentDescription = "Product image",
                        contentScale = ContentScale.Crop
                    )
            }
            Column(Modifier.padding(horizontal = 2.dp).weight(2.8f).align(Alignment.CenterVertically)) {
                Text(
                    name,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                if (categories.count() > 0)
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        val takeCount = 1
                        val remainingCount = categories.count() - takeCount

                        categories.take(takeCount).forEach { category ->
                            SuggestionChip({}, {
                                Text(category, overflow = TextOverflow.Ellipsis, maxLines = 1)
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
}

@Composable
@Preview(name = "Light Mode")
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    name = "Dark Mode"
)
fun RelatedProductCardPreview() {
    CatalogAppTheme {
        Surface {
            Box(Modifier.padding(15.dp)) {
                RelatedProductCard(
                    "Product",
                    listOf(
                        "Category 1",
                        "Category 2",
                        "Category 3",
                        "Category 4"
                    ),
                    Modifier.fillMaxWidth()
                )
            }
        }
    }
}