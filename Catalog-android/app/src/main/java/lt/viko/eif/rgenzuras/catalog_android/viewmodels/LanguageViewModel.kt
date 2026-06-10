package lt.viko.eif.rgenzuras.catalog_android.viewmodels

import android.app.Activity
import android.content.Context
import android.content.res.Configuration
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import lt.viko.eif.rgenzuras.catalog_android.api.ApiService
import lt.viko.eif.rgenzuras.catalog_android.api.Prefs
import lt.viko.eif.rgenzuras.catalog_android.api.getPrefs
import lt.viko.eif.rgenzuras.catalog_android.api.getToken
import lt.viko.eif.rgenzuras.catalog_android.api.savePrefs
import lt.viko.eif.rgenzuras.catalog_android.schema.Language
import java.util.Locale

class LanguageViewModel(
    private val api: ApiService
) : ViewModel() {
    private val _languages = MutableStateFlow(listOf(Language(0, "placeholder", "empty")))
    val languages: StateFlow<List<Language>> = _languages

    private val _appLanguage = MutableStateFlow(AppLanguage.ENGLISH)
    val appLanguage: StateFlow<AppLanguage> = _appLanguage

    private val _contentLanguage = MutableStateFlow("en")
    val contentLanguage: StateFlow<String> = _contentLanguage

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    enum class AppLanguage(
        val code: String,
        val displayName: String
    ) {
        SYSTEM("system", "System default"),
        ENGLISH("en", "English"),
        LITHUANIAN("lt", "Lietuvių"),
        RUSSIAN("ru", "Русский"),
        JAPANESE("ja", "日本語")
    }

    fun loadLanguages(context: Context) {
        viewModelScope.launch {
            _loading.value = true
            val token = getToken(context)

            _languages.value = api.getLanguages("Bearer $token")
            _contentLanguage.value = _languages.value.first().code
            _loading.value = false
        }
    }

    fun setAppLanguage(
        language: AppLanguage
    ) {
        _appLanguage.value = language
    }

    fun setContentLanguage(
        language: String
    ) {
        _contentLanguage.value = language
    }

    fun savePrefs(context: Context, prefs: Prefs) {
        viewModelScope.launch {
            lt.viko.eif.rgenzuras.catalog_android.api.savePrefs(
                context,
                prefs
            )
        }
    }

    suspend fun loadPrefs(context: Context) {
        val prefs = getPrefs(context)

        _appLanguage.value = AppLanguage.entries.firstOrNull {
                it.code == prefs?.uiLang
        } ?: AppLanguage.ENGLISH

        _contentLanguage.value = prefs?.contentLang ?: "en"
    }
}