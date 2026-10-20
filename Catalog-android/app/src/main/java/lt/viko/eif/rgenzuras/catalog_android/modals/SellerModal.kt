package lt.viko.eif.rgenzuras.catalog_android.modals

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.text.capitalize
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.components.LabeledSection
import lt.viko.eif.rgenzuras.catalog_android.components.StyledMultiLineInput
import lt.viko.eif.rgenzuras.catalog_android.components.StyledSingleLineInput
import lt.viko.eif.rgenzuras.catalog_android.sellerViewModel
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.userViewModel
import java.util.Locale

@Composable
fun SellerModal(
    sellerId: Int
) {
    val seller by sellerViewModel.seller.collectAsState()
    val loading by sellerViewModel.loading.collectAsState()
    val user by userViewModel.user.collectAsState()

    LaunchedEffect(sellerId) {
        sellerViewModel.loadSeller(sellerId)
    }

    AppModal(
        title = seller?.name ?: "Seller", onDismiss = {
            activeModal.value = null
        }) {
        if (loading || seller == null) {
            Box(
                modifier = Modifier.fillMaxWidth()
            ) {
                CircularProgressIndicator(
                    modifier = Modifier.align(
                        Alignment.Center
                    )
                )
            }

            return@AppModal
        }

        val myReview = seller!!.reviews.firstOrNull {
            it.user.id == user.id
        }

        val otherReviews = seller!!.reviews.filter {
            it.user.id != user.id
        }

        var title by remember(myReview) {
            mutableStateOf(
                myReview?.title ?: ""
            )
        }

        var content by remember(myReview) {
            mutableStateOf(
                myReview?.content ?: ""
            )
        }

        if (seller!!.stores.isNotEmpty()) {
            LabeledSection(localizedString(R.string.stores).replaceFirstChar {
                if (it.isLowerCase()) it.titlecase(
                    Locale.ROOT
                ) else it.toString()
            }) {
                seller!!.stores.forEach { store ->
                    Card {
                        Column(
                            modifier = Modifier.padding(
                                12.dp
                            ), verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(store.location)
                        }
                    }
                }
            }
        }

        LabeledSection("Your Review") {
            StyledSingleLineInput(
                value = title, onValueChange = {
                    title = it
                }, labelText = "Title", placeholderText = "Review title"
            )

            StyledMultiLineInput(
                value = content, onValueChange = {
                    content = it
                }, labelText = "Content", placeholderText = "Write your review"
            )

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = {
                        if (myReview == null) {
                            sellerViewModel.createReview(
                                seller!!.id, title, content
                            )
                        } else {
                            sellerViewModel.updateReview(
                                seller!!.id, myReview.id, title, content
                            )
                        }
                    }, enabled = !(title.isBlank() || content.isBlank())) {

                    Text(
                        if (myReview == null) "Submit"
                        else "Save"
                    )
                }

                if (myReview != null) {
                    OutlinedButton(
                        onClick = {
                            sellerViewModel.deleteReview(seller!!.id, myReview.id)
                        }) {
                        Text("Delete")
                    }
                }
            }
        }

        if (otherReviews.isNotEmpty()) {
            LabeledSection("Reviews") {
                LazyColumn(
                    modifier = Modifier.heightIn(
                        max = 300.dp
                    ), verticalArrangement = Arrangement.spacedBy(
                        10.dp
                    )
                ) {
                    items(otherReviews) { review ->
                        Card {
                            Column(
                                modifier = Modifier.padding(
                                    12.dp
                                ), verticalArrangement = Arrangement.spacedBy(
                                    6.dp
                                )
                            ) {
                                Text(
                                    review.user.name, style = MaterialTheme.typography.titleSmall
                                )

                                Text(
                                    review.title, style = MaterialTheme.typography.titleMedium
                                )

                                Text(
                                    review.content
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}