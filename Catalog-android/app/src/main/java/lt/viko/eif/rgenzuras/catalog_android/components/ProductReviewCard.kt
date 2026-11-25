package lt.viko.eif.rgenzuras.catalog_android.components

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductReview
import lt.viko.eif.rgenzuras.catalog_android.schema.User
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme

@Composable
fun ProductReviewCard(
    review: ProductReview,
    user: User? = null,
    truncated: Boolean = false,
    onClick: (() -> Unit)? = null
) {
    @Composable
    fun innerContent() {
        Column(
            modifier = Modifier.padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            if (user != null) {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        user.name,
                        style = MaterialTheme.typography.titleSmall
                    )
                    ReviewRating(review.rating)
                }

                if (!truncated)
                    Text(
                        review.title,
                        style = MaterialTheme.typography.titleMedium
                    )
                else
                    Text(
                        review.title,
                        style = MaterialTheme.typography.titleMedium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
            } else {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(2.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (!truncated)
                        Text(
                            review.title,
                            style = MaterialTheme.typography.titleMedium,
                            modifier = Modifier.weight(1f)
                        )
                    else
                        Text(
                            review.title,
                            style = MaterialTheme.typography.titleMedium,
                            modifier = Modifier.weight(1f),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    ReviewRating(review.rating)
                }
            }

            if (!truncated)
                Text(review.content)
        }
    }
    if (onClick != null)
        Card(modifier = Modifier.fillMaxWidth(), onClick = onClick) {
            innerContent()
        }
    else
        Card(modifier = Modifier.fillMaxWidth()) {
            innerContent()
        }
}

@Composable
@Preview(
    name = "Light Mode"
)
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    name = "Dark Mode"
)
fun ProductReviewCardPreview() {
    val user = User(0, "Whatever", "", "")

    CatalogAppTheme {
        Surface(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier
                    .padding(15.dp),
                verticalArrangement = Arrangement.spacedBy(15.dp)
            ) {
                ProductReviewCard(
                    ProductReview(
                        0,
                        User(0, "Review user", "", ""),
                        purchased = true,
                        recommended = true,
                        "123456789012345678901234567890123456789012345678901234567890",
                        "Reallllllly realllly realllly reallly long review test",
                        rating = 1
                    )
                )
                ProductReviewCard(
                    ProductReview(
                        0,
                        User(0, "Review user", "", ""),
                        purchased = true,
                        recommended = true,
                        "123456789012345678901234567890123456789012345678901234567890",
                        "Reallllllly realllly realllly reallly long review test",
                        rating = 1
                    ), User(0, "Review user", "", "")
                )
                ProductReviewCard(
                    ProductReview(
                        0,
                        User(0, "Review user", "", ""),
                        purchased = true,
                        recommended = true,
                        "123456789012345678901234567890123456789012345678901234567890",
                        "Reallllllly realllly realllly reallly long review test",
                        rating = 1
                    ), User(0, "Review user", "", ""), truncated = true
                )
            }
        }
    }
}