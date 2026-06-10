package lt.viko.eif.rgenzuras.catalog_android.modals

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.schema.Recipe
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel

@Composable
fun RecipeModal(
    recipe: Recipe,
    uiLanguage: LanguageViewModel.AppLanguage,
    contentLanguage: String
) {
    val recipeName = recipe.names.firstOrNull({ it.language.code == uiLanguage.code })?.name
        ?: recipe.names.firstOrNull({ it.language.code == contentLanguage })?.name
        ?: recipe.names.first().name

    val recipeContent = recipe.contents.firstOrNull({ it.language.code == uiLanguage.code })?.content
        ?: recipe.contents.firstOrNull({ it.language.code == contentLanguage })?.content
        ?: recipe.contents.first().content

    AppModal(
        title = recipeName,
        onDismiss = {
            activeModal.value = null
        }
    ) {
        Text(recipeContent)
    }
}