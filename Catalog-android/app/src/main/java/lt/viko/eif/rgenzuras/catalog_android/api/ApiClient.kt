package lt.viko.eif.rgenzuras.catalog_android.api

import com.google.gson.GsonBuilder
import lt.viko.eif.rgenzuras.catalog.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.time.Instant

object ApiClient {
    private const val API_URL = BuildConfig.API_URL

    val gson = GsonBuilder()
        .registerTypeAdapter(Instant::class.java, InstantTypeAdapter())
        .create()

    private val client = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .header("Accept", "application/json")
                .build()

            chain.proceed(request)
        }
        .build()

    val retrofit: ApiService = Retrofit.Builder()
        .baseUrl(API_URL)
        .client(client)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()
        .create(ApiService::class.java)
}