package lt.viko.eif.rgenzuras.catalog_android.views

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.BottomAppBar
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentType
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.api.RegisterRequest
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.components.StyledButton
import lt.viko.eif.rgenzuras.catalog_android.components.StyledSingleLineInput
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString
import lt.viko.eif.rgenzuras.catalog_android.ui.theme.CatalogAppTheme
import lt.viko.eif.rgenzuras.catalog_android.userViewModel

@Serializable
data object RegisterScreen : NavKey

@Composable
fun RegisterMenu() {
    var username by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordConfirm by remember { mutableStateOf("") }

    val emailHasErrors by remember {
        derivedStateOf {
            if (email.isNotEmpty()) {
                !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
            } else {
                false
            }
        }
    }

    val loading by userViewModel.loading.collectAsState()

    val context = LocalContext.current

    CatalogAppTheme {
        Scaffold(
            bottomBar = { RegisterFooter() }
        ) { innerPadding ->
            Surface(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize()
            ) {
                Column(
                    modifier = Modifier
                        .padding(15.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(5.dp)
                ) {
                    Card(
                        modifier = Modifier
                            .padding(bottom = 5.dp)
                            .padding(end = 1.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .padding(25.dp, vertical = 20.dp)
                                .fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text(
                                localizedString(R.string.register_title),
                                style = MaterialTheme.typography.headlineLarge,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                                textAlign = TextAlign.Center
                            )
                            Text(
                                localizedString(R.string.register_hint),
                                style = MaterialTheme.typography.titleMedium
                            )
                        }
                    }

                    StyledSingleLineInput(
                        username,
                        { username = it },
                        localizedString(R.string.username),
                        localizedString(R.string.enter_username),
                        modifier = Modifier.semantics {
                            contentType = ContentType.NewUsername
                        }
                    )

                    StyledSingleLineInput(
                        email,
                        { email = it },
                        localizedString(R.string.email),
                        localizedString(R.string.enter_email),
                        error = emailHasErrors,
                        supportingText = if (emailHasErrors) localizedString(R.string.invalid_email) else null,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email
                        ),
                        modifier = Modifier.semantics {
                            contentType = ContentType.EmailAddress
                        }
                    )

                    StyledSingleLineInput(
                        password,
                        { password = it },
                        localizedString(R.string.password),
                        localizedString(R.string.enter_password),
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password
                        ),
                        modifier = Modifier.semantics {
                            contentType = ContentType.NewPassword
                        }
                    )

                    StyledSingleLineInput(
                        passwordConfirm,
                        { passwordConfirm = it },
                        localizedString(R.string.repeat_password),
                        localizedString(R.string.enter_password),
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password
                        ),
                        modifier = Modifier.semantics {
                            contentType = ContentType.NewPassword
                        }
                    )

                    StyledButton(
                        text = localizedString(R.string.register_button),
                        onClick = {
                            userViewModel.register(
                                context,
                                RegisterRequest(username, email, password)
                            )
                        },
                        loading = loading,
                        enabled = !(username.isEmpty() || email.isEmpty() || emailHasErrors || password.isEmpty() || passwordConfirm.isEmpty()) && password == passwordConfirm,
                        modifier = Modifier.padding(top = 10.dp)
                    )
                }

            }
        }

    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterFooter() {
    BottomAppBar(
        containerColor = MaterialTheme.colorScheme.background
    ) {
        Surface(
            shape = RoundedCornerShape(10.dp),
            color = MaterialTheme.colorScheme.primaryContainer,
            contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
            modifier = Modifier.padding(horizontal = 11.dp)
        ) {
            Box(contentAlignment = Alignment.CenterStart) {
                Icon(
                    Icons.Default.Info,
                    "Info",
                    modifier = Modifier.padding(start = 15.dp)
                )

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 15.dp)
                        .padding(start = 40.dp, end = 15.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val annotatedText = buildAnnotatedString {
                        append(localizedString(R.string.already_have_an_account))

                        val start = length
                        append(localizedString(R.string.log_in_here))
                        addStyle(
                            style = SpanStyle(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            ),
                            start = start,
                            end = length
                        )
                        addStringAnnotation(
                            tag = "LOGIN",
                            annotation = "login",
                            start = start,
                            end = length
                        )
                    }

                    ClickableText(
                        text = annotatedText,
                        style = LocalTextStyle.current.copy(
                            textAlign = TextAlign.Center,
                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                            fontWeight = FontWeight.Medium
                        ),
                        onClick = { offset ->
                            annotatedText.getStringAnnotations("LOGIN", offset, offset)
                                .firstOrNull()?.let {
                                    backStack.add(LoginScreen)
                                }
                        }
                    )
                }
            }
        }
    }
}

@Composable
@Preview(
    showSystemUi = true,
    device = "spec:width=1080px,height=2340px,dpi=400",
    name = "Light Mode"
)
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    showSystemUi = true,
    device = "spec:width=1080px,height=2340px,dpi=400",
    name = "Dark Mode"
)
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    showSystemUi = true,
    device = "spec:width=1080px,height=2340px,dpi=400",
    locale = "lt",
    name = "Lith"
)
fun RegisterPreview() {
    RegisterMenu()
}