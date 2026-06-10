package lt.viko.eif.rgenzuras.catalog_android.components

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DropdownList(
    valueIndex: Int,
    values: List<String>,
    onValueChanged: (Int) -> Unit,
    labelText: String,
    loading: Boolean = false
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { if(values.isNotEmpty()) expanded = !expanded },
        modifier = Modifier
            .fillMaxWidth()
            .height(70.dp)
    ) {
        OutlinedTextField(
            value = if(values.isNotEmpty()) values[valueIndex] else "",
            onValueChange = {}, // readOnly
            readOnly = true,
            label = { Text(labelText) },
            singleLine = true,
            leadingIcon = if(loading) {{
                Box(
                    modifier = Modifier.padding(start = 5.dp).height(40.dp).aspectRatio(1f),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center).padding(10.dp))
                }
            }} else null,
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
            modifier = Modifier
                .menuAnchor()
                .fillMaxWidth()
                .height(70.dp),
            shape = RoundedCornerShape(7.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f),
                cursorColor = MaterialTheme.colorScheme.primary,
                focusedTextColor = MaterialTheme.colorScheme.onSurface,
                unfocusedPlaceholderColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                focusedLabelColor = MaterialTheme.colorScheme.primary,
                unfocusedLabelColor = MaterialTheme.colorScheme.onSurface
            )
        )

        if(values.isNotEmpty())
            ExposedDropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
            ) {
                values.forEachIndexed { id, item ->
                    DropdownMenuItem(
                        text = { Text(item) },
                        onClick = {
                            onValueChanged(id)
                            expanded = false
                        }
                    )
                }
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
fun DropdownListPreview() {
    CatalogAppTheme {
        Surface {
            Column(
                modifier = Modifier.padding(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                DropdownList(
                    0,
                    listOf<String>("Really long option", "Option 2", "Option 3"),
                    {},
                    "Test"
                )

                DropdownList(
                    0,
                    listOf<String>(),
                    {},
                    "No options"
                )

                DropdownList(
                    0,
                    emptyList(),
                    {},
                    "Loading",
                    loading = true
                )
            }
        }
    }
}