package lt.viko.eif.rgenzuras.catalog_android.modals

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.schema.Recipe
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel
import java.util.Locale

@Composable
fun RecipeModal(
    recipe: Recipe,
    uiLanguage: LanguageViewModel.AppLanguage,
    contentLanguage: String
) {
    val defaultLanguage = uiLanguage == LanguageViewModel.AppLanguage.SYSTEM

    val recipeName = ((
            if (!defaultLanguage) recipe.names.firstOrNull { it.language.code == uiLanguage.code }
            else recipe.names.firstOrNull { Locale.getDefault().language == it.language.code })
        ?: recipe.names.firstOrNull({ it.language.code == contentLanguage })
        ?: recipe.names.first()).name

    val recipeContent = ((
            if (!defaultLanguage) recipe.contents.firstOrNull { it.language.code == uiLanguage.code }
            else recipe.contents.firstOrNull { Locale.getDefault().language == it.language.code })
        ?: recipe.contents.firstOrNull({ it.language.code == contentLanguage })
        ?: recipe.contents.first()).content

    AppModal(
        title = recipeName,
        onDismiss = {
            activeModal.value = null
        }
    ) {
        Text(recipeContent)
    }
}