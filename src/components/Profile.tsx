import React, { useState } from 'react';

export default function Profile() {

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const baseUrl = import.meta.env.VITE_APP_URL;

    if (!baseUrl) {
      alert("Backend URL missing ❌");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${baseUrl}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed");

      alert("Saved successfully ✅");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Profile</h2>

      <form onSubmit={handleSubmit}>

        <input placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        /><br/><br/>

        <input placeholder="Age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
        /><br/><br/>

        <button type="submit">
          {saving ? "Saving..." : "Save"}
        </button>

      </form>

    </div>
  );
}
