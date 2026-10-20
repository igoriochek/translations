package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.api.LoginRequest
import lt.viko.eif.rgenzuras.catalog_android.api.RegisterRequest
import lt.viko.eif.rgenzuras.catalog_android.api.clearToken
import lt.viko.eif.rgenzuras.catalog_android.api.getPrefs
import lt.viko.eif.rgenzuras.catalog_android.api.getToken
import lt.viko.eif.rgenzuras.catalog_android.api.saveToken
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.loadProductsViewModel
import lt.viko.eif.rgenzuras.catalog_android.schema.ScanHistory
import lt.viko.eif.rgenzuras.catalog_android.schema.User
import lt.viko.eif.rgenzuras.catalog_android.views.BarcodeScannerScreen
import lt.viko.eif.rgenzuras.catalog_android.views.LandingScreen
import lt.viko.eif.rgenzuras.catalog_android.views.PrefsScreen
import lt.viko.eif.rgenzuras.catalog_android.views.ProductsScreen

class UserViewModel(
    private val api: ApiService
) : ViewModel() {
    private val _user = MutableStateFlow(User(0, "", "", ""))
    val user: StateFlow<User> = _user

    private val _history = MutableStateFlow(emptyList<ScanHistory>())
    val history = _history.asStateFlow()

    private val _token = MutableStateFlow<String?>(null)
    val token = _token.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _loadingHistory = MutableStateFlow(false)
    val loadingHistory: StateFlow<Boolean> = _loadingHistory

    suspend fun authenticate(context: Context) : Boolean {
        _loading.value = true
        val token = getToken(context)

        if (token == null) {
            _loading.value = false
            return false
        }

        _token.value = token

        _user.value = api.me("Bearer $token")
        _loading.value = false
        return true;
    }

    fun loadScanHistory() {
        viewModelScope.launch {
            _loadingHistory.value = true
            _history.value = api.getScanHistory("Bearer ${_token.value!!}")
            _loadingHistory.value = false
        }
    }

    fun register(context: Context, request: RegisterRequest) {
        viewModelScope.launch {
            _loading.value = true

            val token = api.register(request).token
            saveToken(context, token)
            loadProductsViewModel(context)

            authenticate(context)
            loadMenu(context)
        }
    }

    fun login(context: Context, request: LoginRequest) {
        viewModelScope.launch {
            _loading.value = true

            val token = api.login(request).token
            saveToken(context, token)
            loadProductsViewModel(context)

            authenticate(context)
            loadMenu(context)
        }
    }

    fun logout(context: Context) {
        viewModelScope.launch {
            _loading.value = true
            val token = getToken(context)

            api.logout("Bearer $token")
            clearToken(context)

            backStack.clear()
            backStack.add(LandingScreen)

            _loading.value = false
        }
    }

    private suspend fun loadMenu(context: Context) {
        val prefs = getPrefs(context)
        backStack.clear()
        backStack.add(if(prefs != null) BarcodeScannerScreen else PrefsScreen)
    }
}