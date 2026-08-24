package lt.viko.eif.rgenzuras.catalog_android.ui.localization

import java.math.BigDecimal
import java.math.RoundingMode
import java.util.Locale
import lt.viko.eif.rgenzuras.catalog_android.schema.MeasurementUnitType

object MeasurementFormatter {

    data class DisplayMeasurement(
        val value: String,
        val unit: String
    )

    private val imperialCountries = setOf("US", "LR", "MM")

    fun format(
        amount: Float,
        unitType: MeasurementUnitType,
        locale: Locale = Locale.getDefault()
    ): DisplayMeasurement {
        val imperial = locale.country.uppercase() in imperialCountries

        return when (unitType.type.lowercase()) {
            "mass" -> if (imperial) formatImperialMass(amount) else formatMetricMass(amount)
            "volume" -> if (imperial) formatImperialVolume(amount) else formatMetricVolume(amount)
            "count" -> DisplayMeasurement(formatNumber(amount.toDouble()), "pcs")
            "none" -> DisplayMeasurement(formatNumber(amount.toDouble()), "")
            else -> DisplayMeasurement(formatNumber(amount.toDouble()), "")
        }
    }

    private fun formatMetricMass(grams: Float): DisplayMeasurement =
        if (grams >= 1000f)
            DisplayMeasurement(formatNumber(grams / 1000.0), "kg")
        else
            DisplayMeasurement(formatNumber(grams.toDouble()), "g")

    private fun formatMetricVolume(ml: Float): DisplayMeasurement =
        if (ml >= 1000f)
            DisplayMeasurement(formatNumber(ml / 1000.0), "L")
        else
            DisplayMeasurement(formatNumber(ml.toDouble()), "ml")

    private fun formatImperialMass(grams: Float): DisplayMeasurement {
        val pounds = grams / 453.59237

        return if (pounds >= 1.0)
            DisplayMeasurement(formatNumber(pounds), "lb")
        else
            DisplayMeasurement(formatNumber(grams / 28.349523125), "oz")
    }

    private fun formatImperialVolume(ml: Float): DisplayMeasurement =
        DisplayMeasurement(
            formatNumber(ml / 29.5735295625),
            "fl oz"
        )

    private fun formatNumber(value: Double): String =
        BigDecimal(value)
            .setScale(2, RoundingMode.HALF_UP)
            .stripTrailingZeros()
            .toPlainString()
}