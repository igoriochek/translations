package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class ProductIngredient(val id: Int, val ingredient: Ingredient, @SerializedName("unit_type") val unitType: MeasurementUnitType, val amount: Float)
