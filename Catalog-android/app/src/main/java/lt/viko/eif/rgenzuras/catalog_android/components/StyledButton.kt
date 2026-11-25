package lt.viko.eif.rgenzuras.catalog_android.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import lt.viko.eif.rgenzuras.catalog.R

@Composable
fun StyledButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    textColor: Color? = null,
    colors: ButtonColors? = null,
    enabled: Boolean = true,
    outlined: Boolean = false,
    loading: Boolean = false
) {
    @Composable
    fun innerContent() {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.CenterStart) {
            Row {
                AnimatedVisibility(
                    visible = loading,
                    enter = fadeIn(),
                    exit = fadeOut(
                        animationSpec = spring(
                            stiffness = Spring.StiffnessMediumLow,
                            visibilityThreshold = 0.10f,
                        ),
                    ),
                ) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        color = LocalContentColor.current,
                        strokeWidth = 1.5f.dp,
                        strokeCap = StrokeCap.Round,
                    )
                }
            }

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = textColor ?: if (enabled) MaterialTheme.colorScheme.onPrimary else Color.Unspecified,
                    textAlign = TextAlign.Center,
                    maxLines = 1
                )
            }
        }
    }

    if(outlined)
        OutlinedButton(
            onClick = onClick,
            modifier = modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(7.dp),
            colors = colors ?: ButtonDefaults.outlinedButtonColors(),
            enabled = enabled && !loading
        ) {
            innerContent()
        }
    else
        Button(
            onClick = onClick,
            modifier = modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(7.dp),
            colors = colors ?: ButtonDefaults.buttonColors(),
            enabled = enabled && !loading
        ) {
            innerContent()
        }
}