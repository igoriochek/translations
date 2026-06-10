package lt.viko.eif.rgenzuras.catalog_android.views

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme

@Serializable
data object LoadingScreen : NavKey

@Composable
fun LoadingMenu() {
    CatalogAppTheme {
        Surface {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }
    }
}