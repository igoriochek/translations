package lt.viko.eif.rgenzuras.catalog_android.modals

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.HorizontalDivider
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.components.KeyValueDisplay
import lt.viko.eif.rgenzuras.catalog_android.components.StyledMultiLineInput
import lt.viko.eif.rgenzuras.catalog_android.components.StyledSingleLineInput
import lt.viko.eif.rgenzuras.catalog_android.manufacturerReviewViewModel
import lt.viko.eif.rgenzuras.catalog_android.schema.Manufacturer
import lt.viko.eif.rgenzuras.catalog_android.userViewModel

@Composable
fun ManufacturerModal(
    manufacturer: Manufacturer
) {
    val user by userViewModel.user.collectAsState()
    val reviews by manufacturerReviewViewModel.reviews.collectAsState()

    val myReview = reviews.firstOrNull {
        it.user.id == user.id
    }

    val otherReviews = reviews.filter {
        it.user.id != user.id
    }

    var title by remember(myReview) {
        mutableStateOf(myReview?.title ?: "")
    }

    var content by remember(myReview) {
        mutableStateOf(myReview?.content ?: "")
    }

    LaunchedEffect(manufacturer.id) {
        manufacturerReviewViewModel.loadReviews(
            manufacturer.id
        )
    }

    AppModal(
        title = manufacturer.name,
        onDismiss = {
            activeModal.value = null
        }
    ) {
        manufacturer.country?.let {
            KeyValueDisplay(
                "Country",
                it
            )
        }

        HorizontalDivider()

        Text(
            "Your Review",
            style = MaterialTheme.typography.titleMedium
        )

        StyledSingleLineInput(
            value = title,
            onValueChange = {
                title = it
            },
            labelText = "Title",
            placeholderText = "Review title"
        )

        StyledMultiLineInput(
            value = content,
            onValueChange = {
                content = it
            },
            labelText = "Content",
            placeholderText = "Write your review"
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = {

                    if(myReview == null) {

                        manufacturerReviewViewModel
                            .createReview(
                                manufacturer.id,
                                title,
                                content
                            )

                    } else {

                        manufacturerReviewViewModel
                            .updateReview(
                                myReview.id,
                                title,
                                content
                            )
                    }
                }
            ) {
                Text(
                    if(myReview == null)
                        "Submit"
                    else
                        "Save"
                )
            }

            if(myReview != null) {
                OutlinedButton(
                    onClick = {

                        manufacturerReviewViewModel
                            .deleteReview(
                                myReview.id
                            )
                    }
                ) {
                    Text("Delete")
                }
            }
        }

        HorizontalDivider()

        Text(
            "Reviews",
            style = MaterialTheme.typography.titleMedium
        )

        LazyColumn(
            modifier = Modifier.heightIn(max = 300.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {

            items(otherReviews) { review ->

                Card {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement =
                            Arrangement.spacedBy(6.dp)
                    ) {

                        Text(
                            review.user.name,
                            style =
                                MaterialTheme.typography.titleSmall
                        )

                        Text(
                            review.title,
                            style =
                                MaterialTheme.typography.titleMedium
                        )

                        Text(review.content)
                    }
                }
            }
        }
    }
}