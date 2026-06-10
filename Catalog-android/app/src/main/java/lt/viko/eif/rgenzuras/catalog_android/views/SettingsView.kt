package lt.viko.eif.rgenzuras.catalog_android.views

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.components.DropdownList
import lt.viko.eif.rgenzuras.catalog_android.components.StyledButton
import lt.viko.eif.rgenzuras.catalog_android.languageViewModel
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.userViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel.AppLanguage

@Serializable
data object SettingsScreen : NavKey

@Composable
fun SettingsMenu() {
    val context = LocalContext.current
    val loading by languageViewModel.loading.collectAsState()
    val appLanguage by languageViewModel.appLanguage.collectAsState()
    val contentLanguage by languageViewModel.contentLanguage.collectAsState()

    val uiOptions = AppLanguage.entries.map { it.displayName }
    val contentOptions by languageViewModel.languages.collectAsState()

    var selectedUi by remember { mutableIntStateOf(AppLanguage.entries.indexOf(appLanguage)) }
    var selectedContent by remember {
        mutableIntStateOf(contentOptions.map { it.code }.indexOf(contentLanguage))
    }

    Surface {
        Scaffold { padding ->

            Column(
                modifier = Modifier
                    .padding(padding)
                    .padding(15.dp),
                verticalArrangement =
                    Arrangement.spacedBy(15.dp)
            ) {

                Text(
                    localizedString(R.string.settings),
                    style =
                        MaterialTheme.typography.headlineMedium
                )

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
                                languageViewModel.setContentLanguage(contentOptions[selectedContent].code)
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
                        localizedString(R.string.log_out),
                        {
                            userViewModel.logout(context)
                        },
                        enabled = true,
                        loading = loading
                    )
                }
            }
        }
    }
}