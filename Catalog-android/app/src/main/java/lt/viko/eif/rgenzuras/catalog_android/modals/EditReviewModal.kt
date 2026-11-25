package lt.viko.eif.rgenzuras.catalog_android.modals

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.api.ProductReviewRequest
import lt.viko.eif.rgenzuras.catalog_android.components.SelectionButton
import lt.viko.eif.rgenzuras.catalog_android.components.StyledButton
import lt.viko.eif.rgenzuras.catalog_android.components.StyledMultiLineInput
import lt.viko.eif.rgenzuras.catalog_android.components.StyledSingleLineInput
import lt.viko.eif.rgenzuras.catalog_android.productViewModel
import lt.viko.eif.rgenzuras.catalog_android.schema.Product
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductReview
import lt.viko.eif.rgenzuras.catalog_android.schema.User
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.userViewModel

@Composable
private fun ModalContent(
    user: User,
    review: ProductReview? = null,
    loading: Boolean = false,
    onSave: (ProductReviewRequest) -> Unit = {},
    onDelete: () -> Unit = {}
) {
    var purchased by remember(review) {
        mutableStateOf(review?.purchased ?: false)
    }

    var recommended by remember(review) {
        mutableStateOf(review?.recommended ?: false)
    }

    var rating by remember(review) {
        mutableIntStateOf(review?.rating ?: 0)
    }

    var title by remember(review) {
        mutableStateOf(review?.title ?: "")
    }

    var content by remember(review) {
        mutableStateOf(review?.content ?: "")
    }

    var buttonSelected by remember(review) {
        mutableIntStateOf(0)
    }

    val modified by remember(purchased, recommended, rating, title, content, review) {
        derivedStateOf {
            if(review == null) true else !(
                purchased == review.purchased &&
                recommended == review.recommended &&
                rating == review.rating &&
                title == review.title &&
                content == review.content
            )
        }
    }

    Column(
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Purchase
        Column(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                localizedString(R.string.have_you_purchased_this_product),
                style = MaterialTheme.typography.titleSmall
            )

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                SelectionButton(
                    text = localizedString(R.string.didn_t_purchase),
                    selected = !purchased,
                    onClick = { purchased = false },
                    modifier = Modifier.weight(1f)
                )

                SelectionButton(
                    text = localizedString(R.string.purchased),
                    selected = purchased,
                    onClick = { purchased = true },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Recommendation
        Column(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                localizedString(R.string.would_you_recommend_this_product_to_others),
                style = MaterialTheme.typography.titleSmall
            )

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                SelectionButton(
                    text = localizedString(R.string.don_t_recommend),
                    selected = !recommended,
                    onClick = { recommended = false },
                    modifier = Modifier.weight(1f)
                )

                SelectionButton(
                    text = localizedString(R.string.recommend),
                    selected = recommended,
                    onClick = { recommended = true },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Rating
        Column(
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                localizedString(R.string.your_rating),
                style = MaterialTheme.typography.titleSmall
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row {
                    repeat(5) { index ->
                        IconButton(
                            onClick = { rating = index + 1 },
                            modifier = Modifier.size(40.dp)
                        ) {
                            Icon(
                                imageVector = if (index < rating)
                                    Icons.Filled.Star
                                else
                                    Icons.Outlined.StarBorder,
                                contentDescription = "${index + 1} stars",
                                tint = if (index < rating)
                                    MaterialTheme.colorScheme.primary
                                else
                                    MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }
                }

                Text(
                    "$rating/5",
                    style = MaterialTheme.typography.titleSmall
                )
            }
        }

        // Written review
        Column(
            verticalArrangement = Arrangement.spacedBy(7.dp)
        ) {
            Text(
                localizedString(R.string.your_review),
                style = MaterialTheme.typography.titleSmall
            )

            StyledSingleLineInput(
                value = title,
                onValueChange = { title = it },
                labelText = localizedString(R.string.title),
                placeholderText = localizedString(R.string.review_title),
                maxCharacters = 60
            )

            StyledMultiLineInput(
                value = content,
                onValueChange = { content = it },
                labelText = localizedString(R.string.content),
                placeholderText = localizedString(R.string.write_your_review),
                maxCharacters = 250
            )
        }

        // Actions
        if (review == null) {
            StyledButton(
                onClick = {
                    buttonSelected = 1
                    onSave(
                        ProductReviewRequest(
                            purchased = purchased,
                            recommended = recommended,
                            title = title,
                            content = content,
                            rating = rating
                        )
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = rating in 1..5 &&
                        title.isNotBlank() &&
                        content.isNotBlank(),
                loading = loading && buttonSelected == 1,
                text = localizedString(R.string.submit_review)
            )
        } else {
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                StyledButton(
                    onClick = {
                        buttonSelected = 2
                        onSave(
                            ProductReviewRequest(
                                purchased = purchased,
                                recommended = recommended,
                                title = title,
                                content = content,
                                rating = rating
                            )
                        )
                    },
                    modifier = Modifier.weight(1f),
                    enabled = rating in 1..5 &&
                            title.isNotBlank() &&
                            content.isNotBlank() &&
                            modified,
                    loading = loading && buttonSelected == 2,
                    text = localizedString(R.string.save_changes)
                )

                StyledButton(
                    onClick = {
                        buttonSelected = 3
                        onDelete()
                    },
                    modifier = Modifier.weight(1f),
                    textColor = MaterialTheme.colorScheme.onError,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.error
                    ),
                    loading = loading && buttonSelected == 3,
                    text = localizedString(R.string.delete_review)
                )
            }
        }
    }
}

@Composable
fun EditReviewModal(
    product: Product
) {
    val user by userViewModel.user.collectAsState()

    val myReview by remember { derivedStateOf { product.reviews.firstOrNull {
        it.user.id == user.id
    }}}

    val loading by productViewModel.reviewLoading.collectAsState()

    val token by userViewModel.token.collectAsState()

    AppModal(
        if (myReview != null)
            localizedString(R.string.edit_review)
        else
            localizedString(R.string.create_review),
        { activeModal.value = ProductReviewsModalProps(product) }
    ) {
        ModalContent(
            user,
            myReview,
            loading,
            onSave = { request ->
                if(myReview == null)
                    productViewModel.createReview(token!!,product.id, request)
                else
                    productViewModel.updateReview(token!!, myReview!!.id, request)
            },
            onDelete = {
                productViewModel.deleteReview(token!!, myReview!!.id)
            }
        )
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
fun EditReviewModalPreview() {
    val user = User(0, "", "", "")

    CatalogAppTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .systemBarsPadding()
                    .padding(horizontal = 15.dp)
            ) {
                ModalContent(
                    user,
                    ProductReview(0, user, true, false, "Title", "Content", 3)
                )
            }
        }
    }
}