package lt.viko.eif.rgenzuras.catalog_android.modals

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.components.ProductReviewCard
import lt.viko.eif.rgenzuras.catalog_android.schema.Product
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductReview
import lt.viko.eif.rgenzuras.catalog_android.schema.User
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.userViewModel

@Composable
private fun ColumnScope.ModalContent(
    myReview: ProductReview?,
    otherReviews: List<ProductReview>,
    onEdit: () -> Unit = {}
) {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.height(350.dp)
    ) {
        if (otherReviews.isEmpty())
            item {
                Text(
                    localizedString(R.string.no_other_reviews_yet),
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
            }

        items(otherReviews) { review ->
            ProductReviewCard(review, review.user)
        }
    }

    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        HorizontalDivider()

        if (myReview != null) {
            Text(
                localizedString(R.string.your_review),
                style = MaterialTheme.typography.titleSmall
            )
            ProductReviewCard(myReview, onClick = onEdit)
        } else {
            OutlinedButton(
                onClick = onEdit,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    localizedString(R.string.write_a_review),
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun ProductReviewsModal(
    product: Product
) {
    val user by userViewModel.user.collectAsState()
    val reviews = product.reviews.sortedByDescending { it.createdAt }

    val myReview = reviews.firstOrNull {
        it.user.id == user.id
    }

    val otherReviews = reviews.filter {
        it.user.id != user.id
    }

    AppModal(
        title = localizedString(R.string.product_reviews),
        onDismiss = {
            activeModal.value = null
        }
    ) {
        ModalContent(myReview, otherReviews, { activeModal.value = EditReviewModalProps(product) })
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
fun ProductReviewsModalPreview() {
    val user = User(0, "Whatever", "", "")

    CatalogAppTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .systemBarsPadding()
                    .padding(horizontal = 15.dp)
            ) {
                ModalContent(
                    ProductReview(
                        0,
                        user,
                        true,
                        false,
                        "Title",
                        "Content",
                        3
                    ),
                    listOf(
                        ProductReview(
                            0,
                            user,
                            true,
                            false,
                            "Title",
                            "Content",
                            3
                        )
                    )
                )
            }
        }
    }
}