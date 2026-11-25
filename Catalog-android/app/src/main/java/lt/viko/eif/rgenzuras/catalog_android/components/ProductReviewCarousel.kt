package lt.viko.eif.rgenzuras.catalog_android.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import kotlinx.coroutines.delay
import lt.viko.eif.rgenzuras.catalog_android.schema.ProductReview
import kotlin.time.Duration.Companion.milliseconds

@Composable
fun ProductReviewCarousel(
    reviews: List<ProductReview>,
    modifier: Modifier = Modifier,
    autoAdvanceMillis: Int = 7000
) {
    if (reviews.isEmpty())
        return

    val pagerState = rememberPagerState {
        reviews.size
    }

    LaunchedEffect(Unit) {
        while (true) {
            delay(autoAdvanceMillis.toLong().milliseconds)

            pagerState.animateScrollToPage(
                (pagerState.currentPage + 1) % reviews.size
            )
        }
    }

    HorizontalPager(
        state = pagerState,
        modifier = modifier
    ) { page ->
        val review = reviews[page]
        ProductReviewCard(review, review.user, true)
    }
}