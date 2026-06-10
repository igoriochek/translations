package lt.viko.eif.rgenzuras.catalog_android.ui.localization

import androidx.compose.runtime.compositionLocalOf
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel

val LocalAppLanguage = compositionLocalOf { LanguageViewModel.AppLanguage.SYSTEM }