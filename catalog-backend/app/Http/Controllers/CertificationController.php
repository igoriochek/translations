<?php

namespace App\Http\Controllers;

use App\Models\Product\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificationController extends Controller {
	public function index() {
		return Certification::all();
	}

    public function create(Request $request) {
        $validated = $request->validate([
            'label' => 'string|required',
            'image' => 'image|mimes:jpeg,png,jpg,svg|max:65536|required',
        ]);

        $image = $request->file('image');
        $path = $image->store('certifications', 'public');

        return response()->json(Certification::create([
            'label' => $validated['label'],
            'badge_url' => url('storage/' . $path),
            'badge_path' => $path,
        ]), 201);
    }

    public function update(Request $request, $id) {
        $request->merge(["id" => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:certifications,id',
            'label' => 'string|sometimes',
            'image' => 'image|mimes:jpeg,png,jpg,svg|max:65536|sometimes',
        ]);

        $certification = Certification::findOrFail($id);
        $data = [
            'label' => $certification->label,
            'badge_url' => $certification->badge_url,
            'badge_path' => $certification->badge_path,
        ];
        if($request->label) {
            $data['label'] = $request->label;
        }

        if ($request->image) {
            $image = $request->file('image');
            $path = $image->store('certifications', 'public');

            Storage::disk('public')->delete($certification->badge_path);
            $data['badge_url'] = url('storage/' . $path);
            $data['badge_path'] = $path;
        }

        $certification->update($data);
        return response()->json($certification);
    }

    public function delete(Request $request, $id) {
        $request->merge(["id" => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:certifications,id',
        ]);
        $certification = Certification::findOrFail($id);
        $certification->delete();
        return response()->json(['message' => 'successfully deleted']);
    }
}
