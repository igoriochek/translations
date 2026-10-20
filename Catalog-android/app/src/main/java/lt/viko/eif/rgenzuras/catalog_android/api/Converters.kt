package lt.viko.eif.rgenzuras.catalog_android.api

import android.content.Context
import android.net.Uri
import com.google.gson.TypeAdapter
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonToken
import com.google.gson.stream.JsonWriter
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.io.FileOutputStream
import java.time.Instant

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

class InstantTypeAdapter : TypeAdapter<Instant>() {

    override fun write(out: JsonWriter, value: Instant?) {
        if (value == null) {
            out.nullValue()
        } else {
            out.value(value.toString())
        }
    }

    override fun read(reader: JsonReader): Instant? {
        if (reader.peek() == JsonToken.NULL) {
            reader.nextNull()
            return null
        }

        return Instant.parse(reader.nextString())
    }
}