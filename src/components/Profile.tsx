import React, { useState } from 'react';
import { 
  User, Save, Scale, Ruler, Calendar, Activity, Heart,
  ChevronRight, Info
} from 'lucide-react';
import { motion } from 'motion/react';
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

  // ✅ FIXED SAVE FUNCTION
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const updatedProfile = await res.json();
      console.log("Saved Profile:", updatedProfile);

      onUpdate(updatedProfile);

      alert("Profile saved successfully ✅");

    } catch (error) {
      console.error('Error saving profile:', error);
      alert("Failed to save profile ❌");
    } finally {
      setSaving(false);
    }
  };

  const activityOptions = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
    { id: 'light', label: 'Light', desc: '1-3 days/week' },
    { id: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
    { id: 'active', label: 'Active', desc: '6-7 days/week' },
    { id: 'very_active', label: 'Very Active', desc: 'Hard exercise 2x/day' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Health Profile</h1>
        <p className="text-gray-500">We use this information to calculate your personalized nutrition targets.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-lg">Basic Information</h3>

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-50"
          />

          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl bg-gray-50"
          />
        </div>

        {/* Stats */}
        <div className="bg-white rounded-[2rem] p-8 space-y-4">
          <input
            type="number"
            placeholder="Height"
            value={formData.height}
            onChange={e => setFormData({ ...formData, height: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl bg-gray-50"
          />

          <input
            type="number"
            placeholder="Weight"
            value={formData.weight}
            onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl bg-gray-50"
          />
        </div>

        {/* Activity */}
        <div className="bg-white rounded-[2rem] p-8 space-y-3">
          {activityOptions.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFormData({ ...formData, activityLevel: opt.id as any })}
              className={`p-3 rounded-xl w-full ${
                formData.activityLevel === opt.id ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Health */}
        <textarea
          placeholder="Health Issues"
          value={formData.healthIssues}
          onChange={e => setFormData({ ...formData, healthIssues: e.target.value })}
          className="w-full p-3 rounded-xl bg-gray-50"
        />

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-500 text-white py-4 rounded-xl"
        >
          {saving ? "Saving..." : "Save Changes & Calculate Targets"}
        </button>

      </form>
    </div>
  );
}
