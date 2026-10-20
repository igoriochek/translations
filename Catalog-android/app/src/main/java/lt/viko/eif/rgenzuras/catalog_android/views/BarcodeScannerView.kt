package lt.viko.eif.rgenzuras.catalog_android.views

import android.Manifest
import android.content.pm.PackageManager
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.navigation3.runtime.NavKey
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.common.InputImage
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import lt.viko.eif.rgenzuras.catalog.R
import lt.viko.eif.rgenzuras.catalog_android.activeModal
import lt.viko.eif.rgenzuras.catalog_android.backStack
import lt.viko.eif.rgenzuras.catalog_android.modals.ScanHistoryModalProps
import lt.viko.eif.rgenzuras.catalog_android.productsViewModel
import lt.viko.eif.rgenzuras.catalog_android.scope
import lt.viko.eif.rgenzuras.catalog_android.ui.localization.localizedString

@Serializable
data object BarcodeScannerScreen : NavKey

@ExperimentalGetImage
@Composable
fun BarcodeScannerMenu() {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    var hasPermission by remember { mutableStateOf(false) }
    var canScan by remember { mutableStateOf(true) }

    val notFoundText = localizedString(R.string.product_not_found)

    val cameraPermissionLauncher =
        rememberLauncherForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { granted ->

            if (granted) {
                hasPermission = true
            } else {
                Toast.makeText(
                    context,
                    "Camera permission required",
                    Toast.LENGTH_SHORT
                ).show()

                backStack.removeLastOrNull()
            }
        }

    LaunchedEffect(Unit) {

        when {

            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
                hasPermission = true
            }

            else -> {
                cameraPermissionLauncher.launch(
                    Manifest.permission.CAMERA
                )
                hasPermission = false
            }
        }
    }

    var scanned by remember {
        mutableStateOf(false)
    }

    if (hasPermission)
        Box(Modifier.fillMaxSize()) {
            AndroidView(
                factory = { ctx ->

                    val previewView = PreviewView(ctx)

                    val cameraProviderFuture =
                        ProcessCameraProvider.getInstance(ctx)

                    cameraProviderFuture.addListener({

                        val cameraProvider =
                            cameraProviderFuture.get()

                        val preview =
                            Preview.Builder()
                                .build()
                                .also {
                                    it.surfaceProvider =
                                        previewView.surfaceProvider
                                }

                        val scanner =
                            BarcodeScanning.getClient()

                        val imageAnalyzer =
                            ImageAnalysis.Builder()
                                .build()

                        imageAnalyzer.setAnalyzer(
                            ContextCompat.getMainExecutor(ctx)
                        ) { imageProxy ->

                            if (scanned || activeModal.value == ScanHistoryModalProps) {
                                imageProxy.close()
                                return@setAnalyzer
                            }

                            val mediaImage =
                                imageProxy.image

                            if (mediaImage != null) {

                                val image =
                                    InputImage.fromMediaImage(
                                        mediaImage,
                                        imageProxy.imageInfo.rotationDegrees
                                    )

                                scanner.process(image)
                                    .addOnSuccessListener { barcodes ->

                                        val code =
                                            barcodes.firstOrNull()?.rawValue

                                        if (code != null) {
                                            scanned = true

                                            scope.launch {
                                                try {
                                                    val product =
                                                        productsViewModel.getProductByCode(code)
                                                    productsViewModel.addSearchResult(product.id)

                                                    backStack.add(ProductScreen(product.id))

                                                } catch (e: Exception) {
                                                    Toast
                                                        .makeText(
                                                            context,
                                                            notFoundText,
                                                            Toast.LENGTH_SHORT
                                                        )
                                                        .show()

                                                    delay(2000)

                                                    scanned = false
                                                }
                                            }
                                        }
                                    }
                                    .addOnCompleteListener {
                                        imageProxy.close()
                                    }
                            } else {
                                imageProxy.close()
                            }
                        }

                        cameraProvider.unbindAll()

                        cameraProvider.bindToLifecycle(
                            lifecycleOwner,
                            CameraSelector.DEFAULT_BACK_CAMERA,
                            preview,
                            imageAnalyzer
                        )

                    }, ContextCompat.getMainExecutor(ctx))

                    previewView
                },
                modifier = Modifier.fillMaxSize()
            )

            Box(
                Modifier
                    .align(Alignment.Center)
                    .width(250.dp)
                    .aspectRatio(2 / 1f)
                    .border(
                        2.dp,
                        MaterialTheme.colorScheme.primary
                    )
            )

            Surface(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(30.dp)
                    .navigationBarsPadding(),
                shape = RoundedCornerShape(12.dp),
                color = MaterialTheme.colorScheme.primary,
                shadowElevation = 2.dp
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.padding(horizontal = 11.dp, vertical = 7.dp)
                ) {
                    IconButton(
                        {
                            activeModal.value = ScanHistoryModalProps
                        }
                    ) {
                        Icon(Icons.Default.History, "History")
                    }
                    IconButton(
                        {
                            backStack.add(SettingsScreen)
                        }
                    ) {
                        Icon(Icons.Default.Settings, "Settings")
                    }
                }
            }
        }
    else
        LoadingMenu()
}