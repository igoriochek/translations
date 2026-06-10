package lt.viko.eif.rgenzuras.catalog_android.components

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusState
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme

@Composable
fun StyledSingleLineInput(
    value: String,
    onValueChange: (String) -> Unit,
    labelText: String,
    placeholderText: String,
    modifier: Modifier = Modifier,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    error: Boolean = false,
    supportingText: String? = null,
    onFocusChange: (FocusState) -> Unit = {}
) {
    Column {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(labelText) },
            placeholder = { Text(placeholderText) },
            singleLine = true,
            modifier = modifier
                .fillMaxWidth()
                .onFocusChanged(onFocusChange),
            shape = RoundedCornerShape(7.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.onSurface.copy(
                    alpha = 0.4f
                ),
                cursorColor = MaterialTheme.colorScheme.primary,
                focusedTextColor = MaterialTheme.colorScheme.onSurface,
                unfocusedPlaceholderColor = MaterialTheme.colorScheme.onSurface.copy(
                    alpha = 0.5f
                ),
                focusedLabelColor = MaterialTheme.colorScheme.primary,
                unfocusedLabelColor = MaterialTheme.colorScheme.onSurface
            ),
            isError = error,
            visualTransformation = visualTransformation,
            keyboardOptions = keyboardOptions
        )

        if (supportingText != null) {
            Text(
                supportingText,
                modifier.padding(start = 3.dp, top = 2.dp),
                style = MaterialTheme.typography.labelLarge,
                color = if (error)
                    MaterialTheme.colorScheme.error.copy(alpha = .7f)
                else
                    MaterialTheme.colorScheme.onSurface.copy(alpha = .7f)
            )
        }
    }
}

@Composable
@Preview(name = "Light Mode")
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    name = "Dark Mode"
)
fun StyledSingleLineInputPreview() {
    CatalogAppTheme {
        Surface {
            Column(
                modifier = Modifier.padding(10.dp),
                verticalArrangement = Arrangement.spacedBy(5.dp)
            ) {
                StyledSingleLineInput("", {}, "Label display", "Placeholder")
                StyledSingleLineInput("Text", {}, "Input display", "Placeholder")
                StyledSingleLineInput(
                    "Password", {}, "Password display", "Placeholder",
                    visualTransformation = PasswordVisualTransformation()
                )
                StyledSingleLineInput(
                    "Supporting text test",
                    {},
                    "Supporting text display",
                    "Placeholder",
                    supportingText = "Supporting text"
                )
                StyledSingleLineInput(
                    "Supporting text test",
                    {},
                    "Error display",
                    "Placeholder",
                    error = true,
                    supportingText = "Error"
                )
            }
        }
    }
}