package lt.viko.eif.rgenzuras.catalog_android.components

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.outlined.HideImage
import androidx.compose.material3.Card
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme

@Composable
fun LabeledSection(
    label: String,
    modifier: Modifier = Modifier,
    icon: @Composable (RowScope.() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit = {}
) {
    Column(modifier = modifier) {
        Row(horizontalArrangement = Arrangement.spacedBy(3.dp), verticalAlignment = Alignment.CenterVertically) {
            if(icon != null)
                icon()

            Text(label, style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(vertical = 2.dp))
        }
        HorizontalDivider()
        Column(
            modifier = Modifier
                .padding(10.dp)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            content = content
        )
    }
}

@Composable
@Preview(name = "Light Mode")
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    name = "Dark Mode"
)
private fun LabeledSectionPreview() {
    data class CarouselItem(val name: String, val description: String)

    val carouselItems = listOf(
        CarouselItem("Item 1", "A very long section no one will read anyways cause they can't"),
        CarouselItem("Item 2", "Test item"),
        CarouselItem("Item 3", "Test item"),
        CarouselItem("Item 4", "Test item"),
        CarouselItem("Item 5", "Test item"),
    )

    CatalogAppTheme {
        Surface {
            Column(
                modifier = Modifier.padding(15.dp),
                verticalArrangement = Arrangement.spacedBy(15.dp)
            ) {
                LabeledSection("Section with text") {
                    Text("Item")
                }

                LabeledSection("Section with icon", icon = {Icon(Icons.Default.Info, "Info")}) {
                    Text("Item")
                }

                LabeledSection("Section with KeyValues") {
                    KeyValueDisplay("Key", "Value")
                }

                LabeledSection("Section with carousel") {
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(items = carouselItems) { item ->
                            Card(modifier = Modifier.width(270.dp)) {
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
                                        Box(contentAlignment = Alignment.Center) {
                                            Icon(
                                                Icons.Outlined.HideImage,
                                                contentDescription = "No image"
                                            )
                                        }
                                    }
                                    Column(Modifier.padding(horizontal = 2.dp).weight(2.8f).align(Alignment.CenterVertically)) {
                                        Text(
                                            item.name,
                                            style = MaterialTheme.typography.titleMedium,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            item.description,
                                            style = MaterialTheme.typography.labelMedium,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
