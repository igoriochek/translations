package lt.viko.eif.rgenzuras.catalog_android.api

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first

data class Prefs(val uiLang: String, val contentLang: String)

val Context.dataStore by preferencesDataStore("user_prefs")
val PAT_KEY = stringPreferencesKey("token")
val UI_KEY = stringPreferencesKey("ui_lang")
val CONTENT_KEY = stringPreferencesKey("content_lang")

suspend fun saveToken(context: Context, token: String) {
    context.dataStore.edit { prefs ->
        prefs[PAT_KEY] = token
    }
}

suspend fun getToken(context: Context): String? {
    val prefs = context.dataStore.data.first()
    return prefs[PAT_KEY]
}

suspend fun clearToken(context: Context) {
    context.dataStore.edit { prefs ->
        prefs.remove(PAT_KEY)
    }
}

suspend fun getPrefs(context: Context) : Prefs? {
    val store = context.dataStore.data.first()

    val ui = store[UI_KEY]
    val content = store[CONTENT_KEY]
    if(ui == null || content == null)
        return null

    return Prefs(ui, content)
}

suspend fun savePrefs(context: Context, data: Prefs) {
    context.dataStore.edit { prefs->
        prefs[UI_KEY] = data.uiLang
        prefs[CONTENT_KEY] = data.contentLang
    }
}

suspend fun clearPrefs(context: Context) {
    context.dataStore.edit { prefs->
        prefs.remove(UI_KEY)
        prefs.remove(CONTENT_KEY)
    }
}


