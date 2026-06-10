package lt.viko.eif.rgenzuras.catalog_android.ui.localization

import android.content.res.Configuration
import androidx.annotation.StringRes
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import java.util.Locale

@Composable
fun localizedString(
    @StringRes id: Int
): String {
    val language = LocalAppLanguage.current
    val context = LocalContext.current

    val configuration = Configuration(context.resources.configuration)
    configuration.setLocale(Locale.forLanguageTag(language.code))

    val localizedContext = context.createConfigurationContext(configuration)
    return localizedContext.getString(id)
}