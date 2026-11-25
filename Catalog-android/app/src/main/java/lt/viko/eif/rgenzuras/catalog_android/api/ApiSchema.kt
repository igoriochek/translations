package lt.viko.eif.rgenzuras.catalog_android.api

import com.google.gson.annotations.SerializedName
import org.json.JSONObject
import retrofit2.Response

data class RegisterRequest(val name: String, val email: String, val password: String)
data class LoginRequest(val email: String, val password: String)

data class LoginResponse(val token: String)

data class PaginatedResponse<T>(
    val data: List<T>,
    @SerializedName("current_page") val currentPage: Int,
    @SerializedName("last_page") val lastPage: Int,
    @SerializedName("per_page") val perPage: Int,
    val total: Int
)

data class ReviewRequest(
    val title: String, val content: String
)

data class ProductReviewRequest(
    val purchased: Boolean,
    val recommended: Boolean,
    val rating: Int,
    val title: String,
    val content: String
)

data class ErrorMessage(val message: String)

fun <T> retrofitErrorHandler(res: Response<T>): T {
    if (res.isSuccessful) {
        return res.body()!!
    } else {
        val errMsg = res.errorBody()?.string()?.let{
            JSONObject(it).getString("message")
        } ?: run {
            res.code().toString()
        }

        throw Exception(errMsg)
    }
}