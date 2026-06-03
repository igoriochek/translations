<?php

namespace App\Http\Controllers;

use App\Models\User\Manufacturer;
use Illuminate\Http\Request;

class ManufacturerController extends Controller
{
    public function index() {
        return Manufacturer::all();
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'country' => 'sometimes|string',
        ]);

        $manufacturer = Manufacturer::create($validated);

        return response()->json($manufacturer, 201);
    }

    public function update(Request $request, $id) {
        $request->merge(["id" => $id]);
        $validated = $request->validate([
            'id' => 'required|exists:manufacturers,id',
            'name' => 'required|string',
            'country' => 'sometimes|string',
        ]);

        $manufacturer = Manufacturer::find($id);

        $manufacturer->update($validated);

        return response()->json($manufacturer);
    }

    public function delete($id) {
        $manufacturer = Manufacturer::find($id);

        if(!$manufacturer) return response()->json(['message' => 'Not found'], 404);

        $manufacturer->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
