package lt.viko.eif.rgenzuras.catalog_android.modals

import lt.viko.eif.rgenzuras.catalog_android.schema.Manufacturer
import lt.viko.eif.rgenzuras.catalog_android.schema.Recipe
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel

sealed interface Modal

data object ProductFiltersModalProps : Modal

data class ManufacturerModalProps(
    val manufacturer: Manufacturer
) : Modal

data class SellerModalProps(
    val sellerId: Int
) : Modal

data class RecipeModalProps(
    val recipe: Recipe,
    val uiLanguage: LanguageViewModel.AppLanguage,
    val contentLanguage: String
) : Modal