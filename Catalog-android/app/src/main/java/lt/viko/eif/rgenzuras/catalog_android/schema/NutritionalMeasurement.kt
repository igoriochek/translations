package lt.viko.eif.rgenzuras.catalog_android.schema

import com.google.gson.annotations.SerializedName

data class NutritionalMeasurement(val id: Int, val amount: Float, val type: NutritionalType, @SerializedName("unit_type") val unitType: MeasurementUnitType)
