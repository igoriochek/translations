package lt.viko.eif.rgenzuras.catalog_android.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.requiredSize
import androidx.compose.foundation.layout.size
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun RatingStars(
    rating: Float,
    modifier: Modifier = Modifier,
    starSize: Dp = 18.dp,
    starSpacing: Dp = 0.dp
) {
    val filledStar = rememberVectorPainter(Icons.Filled.Star)
    val emptyStar = rememberVectorPainter(Icons.Outlined.StarBorder)

    val primaryColor = MaterialTheme.colorScheme.primary
    val emptyColor = MaterialTheme.colorScheme.onSurfaceVariant

    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(starSpacing)
    ) {
        repeat(5) { index ->
            val fill = (rating - index).coerceIn(0f, 1f)

            Canvas(
                modifier = Modifier.size(starSize)
            ) {
                val starBounds = size

                with(emptyStar) {
                    draw(
                        size = starBounds,
                        colorFilter = ColorFilter.tint(emptyColor)
                    )
                }

                if (fill > 0f) {
                    clipRect(
                        right = starBounds.width * fill
                    ) {
                        with(filledStar) {
                            draw(
                                size = starBounds,
                                colorFilter = ColorFilter.tint(primaryColor)
                            )
                        }
                    }
                }
            }
        }
    }
}