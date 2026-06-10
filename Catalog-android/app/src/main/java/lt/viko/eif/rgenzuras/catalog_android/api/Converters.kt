package lt.viko.eif.rgenzuras.catalog_android.api

import android.content.Context
import android.net.Uri
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.io.FileOutputStream

fun String.toTextBody() =
    toRequestBody("text/plain".toMediaType())

fun Number.toTextBody() =
    toString().toRequestBody("text/plain".toMediaType())

fun imagePart(file: File): MultipartBody.Part {
    val requestBody = file.asRequestBody("image/*".toMediaType())
    return MultipartBody.Part.createFormData(
        name = "image",
        filename = file.name,
        body = requestBody
    )
}

fun uriToTempFile(
    context: Context,
    uri: Uri,
    fileName: String = "upload_${System.currentTimeMillis()}"
): File {
    val inputStream = context.contentResolver.openInputStream(uri)
        ?: throw IllegalArgumentException("Unable to open URI")

    val tempFile = File(context.cacheDir, fileName)

    FileOutputStream(tempFile).use { output ->
        inputStream.use { input ->
            input.copyTo(output)
        }
    }

    return tempFile
}