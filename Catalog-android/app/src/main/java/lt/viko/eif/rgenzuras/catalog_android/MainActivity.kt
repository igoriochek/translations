package lt.viko.eif.rgenzuras.catalog_android

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.camera.core.ExperimentalGetImage
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.navigation3.runtime.NavBackStack
import androidx.navigation3.runtime.NavKey
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiClient
import lt.viko.eif.rgenzuras.catalog_android.api.getPrefs
import lt.viko.eif.rgenzuras.catalog_android.api.getToken
import lt.viko.eif.rgenzuras.catalog_android.modals.ManufacturerModal
import lt.viko.eif.rgenzuras.catalog_android.modals.ManufacturerModalProps
import lt.viko.eif.rgenzuras.catalog_android.modals.Modal
import lt.viko.eif.rgenzuras.catalog_android.modals.ProductFiltersModal
import lt.viko.eif.rgenzuras.catalog_android.modals.ProductFiltersModalProps
import lt.viko.eif.rgenzuras.catalog_android.modals.RecipeModal
import lt.viko.eif.rgenzuras.catalog_android.modals.RecipeModalProps
import lt.viko.eif.rgenzuras.catalog_android.modals.SellerModal
import lt.viko.eif.rgenzuras.catalog_android.modals.SellerModalProps
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.LocalAppLanguage
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.AllergenViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.CategoryViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.LanguageViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.ManufacturerReviewViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.ProductViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.ProductsViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.RecipeViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.SellerViewModel
import lt.viko.eif.rgenzuras.catalog_android.viewmodels.UserViewModel
import lt.viko.eif.rgenzuras.catalog_android.views.BarcodeScannerMenu
import lt.viko.eif.rgenzuras.catalog_android.views.BarcodeScannerScreen
import lt.viko.eif.rgenzuras.catalog_android.views.LandingMenu
import lt.viko.eif.rgenzuras.catalog_android.views.LandingScreen
import lt.viko.eif.rgenzuras.catalog_android.views.LoadingMenu
import lt.viko.eif.rgenzuras.catalog_android.views.LoadingScreen
import lt.viko.eif.rgenzuras.catalog_android.views.LoginMenu
import lt.viko.eif.rgenzuras.catalog_android.views.LoginScreen
import lt.viko.eif.rgenzuras.catalog_android.views.PrefsMenu
import lt.viko.eif.rgenzuras.catalog_android.views.PrefsScreen
import lt.viko.eif.rgenzuras.catalog_android.views.ProductMenu
import lt.viko.eif.rgenzuras.catalog_android.views.ProductScreen
import lt.viko.eif.rgenzuras.catalog_android.views.ProductsMenu
import lt.viko.eif.rgenzuras.catalog_android.views.ProductsScreen
import lt.viko.eif.rgenzuras.catalog_android.views.RegisterMenu
import lt.viko.eif.rgenzuras.catalog_android.views.RegisterScreen
import lt.viko.eif.rgenzuras.catalog_android.views.SettingsMenu
import lt.viko.eif.rgenzuras.catalog_android.views.SettingsScreen

lateinit var backStack: NavBackStack<NavKey>
lateinit var scope: CoroutineScope
lateinit var activeModal: MutableState<Modal?>

private val api = ApiClient.retrofit

val userViewModel = UserViewModel(api)
val languageViewModel = LanguageViewModel(api)
lateinit var productsViewModel: ProductsViewModel
    private set
val productViewModel = ProductViewModel(api)
val categoryViewModel = CategoryViewModel(api)
val allergenViewModel = AllergenViewModel(api)
lateinit var manufacturerReviewViewModel: ManufacturerReviewViewModel
    private set
lateinit var sellerViewModel: SellerViewModel
    private set
lateinit var recipeViewModel: RecipeViewModel
    private set

@OptIn(ExperimentalMaterial3Api::class)
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()
        setContent {
            val appLanguage by languageViewModel.appLanguage.collectAsState()

            CompositionLocalProvider(LocalAppLanguage provides appLanguage) {
                CatalogAppTheme {
                    Box {
                        Navigation()
                        ModalManager()
                    }
                }
            }
        }
    }
}

suspend fun loadProductsViewModel(context: Context) {
    productsViewModel = ProductsViewModel(api, getToken(context)!!)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Navigation() {
    val context = LocalContext.current
    scope = rememberCoroutineScope()
    backStack = rememberNavBackStack(LoadingScreen)
    var authenticating by remember { mutableStateOf(true) }
    val user by userViewModel.user.collectAsState()

    LaunchedEffect(Unit) {
        scope.launch {
            val authenticated = userViewModel.authenticate(context)
            if (authenticated) {
                val token = getToken(context)!!
                productsViewModel = ProductsViewModel(api, token)
                productsViewModel.applyFilters(
                    query = "",
                    categories = api.getCategories("Bearer $token").map { it.id },
                    allergens = api.getAllergens("Bearer $token").map { it.id }
                )
            }
            val prefs = getPrefs(context)
            backStack.clear()
            backStack.add(
                when {
                    authenticated && prefs != null -> ProductsScreen
                    authenticated && prefs == null -> PrefsScreen
                    else -> LandingScreen
                }
            )

            if (prefs != null)
                languageViewModel.loadPrefs(context)

            authenticating = false
        }
    }

    LaunchedEffect(user) {
        if (user.id == 0)
            return@LaunchedEffect

        val token = getToken(context)!!

        languageViewModel.loadLanguages(context)
        categoryViewModel.loadCategories(token)
        allergenViewModel.loadAllergens(token)
        manufacturerReviewViewModel = ManufacturerReviewViewModel(api, token)
        sellerViewModel = SellerViewModel(api, token)
        recipeViewModel = RecipeViewModel(api, token)
    }

    val screenWidth = LocalConfiguration.current.screenWidthDp

    Box(modifier = Modifier.fillMaxSize()) {
        when {
            authenticating -> LoadingMenu()
            else -> NavigationContent()
        }
    }
}

@androidx.annotation.OptIn(ExperimentalGetImage::class)
@Composable
fun NavigationContent() {
    if (backStack.last() is LoadingScreen)
        BackHandler { }

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        transitionSpec = {
            // Slide in from right when navigating forward
            slideInHorizontally(initialOffsetX = { it }) togetherWith
                    slideOutHorizontally(targetOffsetX = { -it })
        },
        popTransitionSpec = {
            // Slide in from left when navigating back
            slideInHorizontally(initialOffsetX = { -it }) togetherWith
                    slideOutHorizontally(targetOffsetX = { it })
        },
        predictivePopTransitionSpec = {
            // Slide in from left when navigating back
            slideInHorizontally(initialOffsetX = { -it }) togetherWith
                    slideOutHorizontally(targetOffsetX = { it })
        },
        entryProvider = entryProvider {
            entry<LoadingScreen> {
                LoadingMenu()
            }

            entry<LandingScreen> {
                LandingMenu()
            }

            entry<RegisterScreen> {
                RegisterMenu()
            }

            entry<LoginScreen> {
                LoginMenu()
            }

            entry<PrefsScreen> {
                PrefsMenu()
            }

            entry<ProductsScreen> {
                ProductsMenu()
            }

            entry<BarcodeScannerScreen> {
                BarcodeScannerMenu()
            }

            entry<ProductScreen> { data ->
                ProductMenu(data)
            }

            entry<SettingsScreen> {
                SettingsMenu()
            }
        }
    )
}

@Composable
fun ModalManager() {
    activeModal = remember { mutableStateOf(null) }
    val context = LocalContext.current

    if (activeModal.value != null)
        BackHandler {
            activeModal.value = null
        }

    when (activeModal.value) {
        ProductFiltersModalProps -> {
            ProductFiltersModal()
        }

        is ManufacturerModalProps -> {
            val props = activeModal.value as ManufacturerModalProps

            ManufacturerModal(props.manufacturer)
        }

        is SellerModalProps -> {
            val props = activeModal.value as SellerModalProps

            SellerModal(props.sellerId)
        }

        is RecipeModalProps -> {
            val props = activeModal.value as RecipeModalProps

            RecipeModal(props.recipe, props.uiLanguage, props.contentLanguage)
        }

        else -> {}
    }
}