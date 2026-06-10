package lt.viko.eif.rgenzuras.catalog_android.api

import lt.viko.eif.rgenzuras.catalog_android.schema.Allergen
import lt.viko.eif.rgenzuras.catalog_android.schema.Category
import lt.viko.eif.rgenzuras.catalog_android.schema.Language
import lt.viko.eif.rgenzuras.catalog_android.schema.ManufacturerReview
import lt.viko.eif.rgenzuras.catalog_android.schema.Product
import lt.viko.eif.rgenzuras.catalog_android.schema.Recipe
import lt.viko.eif.rgenzuras.catalog_android.schema.RelatedProduct
import lt.viko.eif.rgenzuras.catalog_android.schema.Seller
import lt.viko.eif.rgenzuras.catalog_android.schema.SellerReview
import lt.viko.eif.rgenzuras.catalog_android.schema.User
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {
    @POST("/api/register")
    suspend fun register(@Body request: RegisterRequest): LoginResponse

    @POST("/api/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("/api/logout")
    suspend fun logout(@Header("Authorization") token: String)

    @GET("/api/me")
    suspend fun me(@Header("Authorization") token: String): User

    @GET("/api/languages")
    suspend fun getLanguages(@Header("Authorization") token: String): List<Language>

    @GET("/api/products")
    suspend fun getProducts(
        @Header("Authorization") token: String,
        @Query("page") page: Int,
        @Query("perPage") perPage: Int,
        @Query("name") name: String?,
        @Query("category_ids[]") categories: List<Int>?,
        @Query("allergen_ids[]") allergens: List<Int>?
    ): PaginatedResponse<RelatedProduct>

    @GET("/api/products/{id}")
    suspend fun getProduct(
        @Header("Authorization") token: String, @Path("id") productId: Int
    ): Product

    @GET("/api/products/code/{code}")
    suspend fun getProductByCode(
        @Header("Authorization") token: String, @Path("code") code: String
    ): Product

    @GET("/api/categories")
    suspend fun getCategories(@Header("Authorization") token: String): List<Category>

    @GET("/api/allergens")
    suspend fun getAllergens(@Header("Authorization") token: String): List<Allergen>

    @GET("/api/manufacturers/{id}/reviews")
    suspend fun getManufacturerReviews(
        @Header("Authorization") token: String, @Path("id") id: Int
    ): List<ManufacturerReview>

    @POST("/api/manufacturers/{id}/reviews")
    suspend fun createManufacturerReview(
        @Header("Authorization") token: String, @Path("id") id: Int, @Body request: ReviewRequest
    ): ManufacturerReview

    @PUT("/api/manufacturer-reviews/{id}")
    suspend fun updateManufacturerReview(
        @Header("Authorization") token: String, @Path("id") id: Int, @Body request: ReviewRequest
    ): ManufacturerReview

    @DELETE("/api/manufacturer-reviews/{id}")
    suspend fun deleteManufacturerReview(
        @Header("Authorization") token: String, @Path("id") id: Int
    )

    @GET("/api/sellers/{id}")
    suspend fun getSeller(
        @Header("Authorization") token: String, @Path("id") id: Int
    ): Seller

    @POST("/api/sellers/{id}/reviews")
    suspend fun createSellerReview(
        @Header("Authorization") token: String, @Path("id") id: Int, @Body review: ReviewRequest
    ): SellerReview

    @PUT("/api/seller-reviews/{id}")
    suspend fun updateSellerReview(
        @Header("Authorization") token: String, @Path("id") id: Int, @Body review: ReviewRequest
    ): SellerReview

    @DELETE("/api/seller-reviews/{id}")
    suspend fun deleteSellerReview(
        @Header("Authorization") token: String, @Path("id") id: Int
    )

    @GET("api/recipes/by-ingredients/{ingredientId}")
    suspend fun getRecipes(
        @Header("Authorization") token: String, @Path("ingredientId") ingredientId: Int
    ): List<Recipe>
}