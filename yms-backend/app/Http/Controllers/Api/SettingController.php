<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::all()->groupBy('type');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value'] ?? '']
            );
        }

        \App\Models\AuditLog::log('update', 'system_setting', null, [], $validated);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
        ]);
    }

    public function getGroup($group)
    {
        $settings = SystemSetting::where('key', 'like', "{$group}_%")->get();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}