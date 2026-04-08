import React, { useState } from 'react';
import { Save, Activity } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile | null;
  onUpdate: (profile: UserProfile) => void;
}

export default function Profile({ profile, onUpdate }: ProfileProps) {

  const [formData, setFormData] = useState<Partial<UserProfile>>(profile || {
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    gender: 'male',
    activityLevel: 'moderate',
    healthIssues: '',
    unit: 'metric'
  });

  const [saving, setSaving] = useState(false);

  // ✅ FULL FIXED FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseUrl = import.meta.env.VITE_APP_URL;

    if (!baseUrl) {
      alert("Backend URL not configured ❌");
      return;
    }

    setSaving(true);

    try {
      console.log("Sending Profile:", formData);

      const res = await fetch(`${baseUrl}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await res.json();
      console.log("Saved profile:", data);

      // ✅ IMPORTANT FIX (NO CRASH)
      onUpdate(formData as UserProfile);

      alert("Profile saved successfully ✅");

    } catch (error) {
      console.error("Save Error:", error);
      alert("Error saving profile ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 rounded bg-gray-100"
        />

        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
          className="w-full p-3 rounded bg-gray-100"
        />

        <input
          type="number"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
          className="w-full p-3 rounded bg-gray-100"
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
          className="w-full p-3 rounded bg-gray-100"
        />

        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
          className="w-full p-3 rounded bg-gray-100"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          value={formData.activityLevel}
          onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
          className="w-full p-3 rounded bg-gray-100"
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>

        <textarea
          placeholder="Health Issues"
          value={formData.healthIssues}
          onChange={(e) => setFormData({ ...formData, healthIssues: e.target.value })}
          className="w-full p-3 rounded bg-gray-100"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-500 text-white py-3 rounded flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Activity className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save />
              Save Changes
            </>
          )}
        </button>

      </form>
    </div>
  );
}
