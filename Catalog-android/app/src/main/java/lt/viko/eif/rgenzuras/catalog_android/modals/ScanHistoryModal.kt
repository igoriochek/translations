package lt.viko.eif.rgenzuras.catalog_android.modals

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.HistoryToggleOff
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.components.RelatedProductCard
import lt.viko.eif.rgenzuras.catalog_android.languageViewModel
import lt.viko.eif.rgenzuras.catalog_android.schema.ScanHistory
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.userViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel
import lt.viko.eif.rgenzuras.catalog_android.views.ProductScreen
import java.util.Locale

@Composable
fun ScanHistoryModal() {
    val scans = userViewModel.history.collectAsState()
    val loading = userViewModel.loadingHistory.collectAsState()

    val uiLanguage by languageViewModel.appLanguage.collectAsState()
    val contentLanguage by languageViewModel.contentLanguage.collectAsState()

    LaunchedEffect(Unit) {
        userViewModel.loadScanHistory()
    }

    HistoryModalContent(scans.value, loading.value, uiLanguage, contentLanguage)
}

@Composable
private fun HistoryModalContent(
    scans: List<ScanHistory>,
    loading: Boolean = false,
    uiLanguage: LanguageViewModel.AppLanguage = LanguageViewModel.AppLanguage.ENGLISH,
    contentLanguage: String = "en"
) {
    AppModal(localizedString(R.string.history), { activeModal.value = null }) {
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            if (loading)
                item {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(5.dp)
                    ) {
                        CircularProgressIndicator(modifier = Modifier.size(38.dp))
                        Text(
                            text = localizedString(R.string.loading_history),
                            style = MaterialTheme.typography.titleLarge
                        )
                    }
                }
            else if (scans.isEmpty())
                item {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(5.dp)
                    ) {
                        Icon(
                            Icons.Default.HistoryToggleOff,
                            modifier = Modifier.size(38.dp),
                            contentDescription = "Empty history"
                        )
                        Text(
                            text = localizedString(R.string.no_history_found),
                            style = MaterialTheme.typography.titleLarge
                        )
                    }
                }
            else
                items(scans, key = { scan -> scan.id }) { scan ->
                    val names = scan.product.names
                    val categories = scan.product.categories

                    val defaultLanguage = uiLanguage == LanguageViewModel.AppLanguage.SYSTEM

                    val productName = ((
                            if (!defaultLanguage) names.firstOrNull { it.language.code == uiLanguage.code }
                            else names.firstOrNull { Locale.getDefault().language == it.language.code })
                        ?: names.firstOrNull { it.language.code == contentLanguage }
                        ?: names.first()).name

                    RelatedProductCard(
                        productName,
                        categories.map { category ->
                            ((
                                    if (!defaultLanguage) category.names.firstOrNull { it.language.code == uiLanguage.code }
                                    else category.names.firstOrNull { Locale.getDefault().language == it.language.code })
                                ?: category.names.firstOrNull { it.language.code == contentLanguage }
                                ?: category.names.first()).name
                        },
                        Modifier.fillMaxWidth(),
                        scan.product.images.firstOrNull()?.imageUrl,
                        onClick = {
                            activeModal.value = null
                            backStack.add(ProductScreen(scan.product.id))
                        }
                    )
                }
        }

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
fun HistoryModalPreview() {
    CatalogAppTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            Box {
                HistoryModalContent(emptyList())
            }
        }
    }
}
