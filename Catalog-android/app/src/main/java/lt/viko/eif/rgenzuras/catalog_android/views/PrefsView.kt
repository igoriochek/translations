package lt.viko.eif.rgenzuras.catalog_android.views

import android.content.res.Configuration
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.api.Prefs
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.components.DropdownList
import lt.viko.eif.rgenzuras.catalog_android.components.StyledButton
import lt.viko.eif.rgenzuras.catalog_android.languageViewModel
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel.AppLanguage

@Serializable
data object PrefsScreen : NavKey

@Composable
fun PrefsMenu() {
    val context = LocalContext.current

    val loading by languageViewModel.loading.collectAsState()

    var selectedUi by remember { mutableIntStateOf(0) }
    var selectedContent by remember { mutableIntStateOf(0) }

    val uiOptions = AppLanguage.entries.map { it.displayName }
    val contentOptions by languageViewModel.languages.collectAsState()

    Surface {
        Scaffold { paddingValues ->
            Column(
                modifier = Modifier
                    .padding(paddingValues)
                    .padding(horizontal = 15.dp, vertical = 10.dp)
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(15.dp)
            ) {
                Card(
                    modifier = Modifier
                        .padding(bottom = 5.dp)
                        .padding(end = 1.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .padding(25.dp, vertical = 20.dp)
                            .fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            localizedString(R.string.prefs_title),
                            style = MaterialTheme.typography.headlineLarge,
                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            localizedString(R.string.prefs_hint),
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }

                Column {
                    DropdownList(
                        selectedUi,
                        uiOptions,
                        {
                            selectedUi = it
                            val language = AppLanguage.entries[selectedUi]
                            languageViewModel.setAppLanguage(language)
                        },
                        localizedString(R.string.interface_language)
                    )
                    Text(
                        localizedString(R.string.interface_language_hint),
                        style = MaterialTheme.typography.labelMedium,
                        modifier = Modifier
                            .padding(horizontal = 3.dp)
                            .padding(top = 2.dp)
                    )
                }

                Column {
                    if (loading)
                        Column(
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth(0.3f)
                                    .height(16.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(
                                        MaterialTheme.colorScheme.surfaceVariant
                                    )
                            )

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(56.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(
                                        MaterialTheme.colorScheme.surfaceVariant
                                    )
                            )

                        }
                    else
                        DropdownList(
                            selectedContent,
                            contentOptions.map { it.name },
                            {
                                selectedContent = it
                            },
                            localizedString(R.string.content_language)
                        )
                    Text(
                        localizedString(R.string.content_language_hint),
                        style = MaterialTheme.typography.labelMedium,
                        modifier = Modifier
                            .padding(horizontal = 3.dp)
                            .padding(top = 2.dp)
                    )
                }

                Column(Modifier.fillMaxHeight(), verticalArrangement = Arrangement.Bottom) {
                    StyledButton(
                        localizedString(R.string.prefs_confirm),
                        {
                            val language = AppLanguage.entries[selectedUi]
                            val content = contentOptions[selectedContent]
                            languageViewModel.savePrefs(
                                context,
                                Prefs(language.code, content.code)
                            )

                            backStack.clear()
                            backStack.add(ProductsScreen)
                        },
                        enabled = true,
                        loading = false
                    )
                }
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
fun PrefsPreview() {
    CatalogAppTheme {
        PrefsMenu()
    }
}