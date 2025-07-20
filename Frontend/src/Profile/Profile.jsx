import { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css'; // 👈 Import the CSS

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setProfile(res.data);
    }).catch(err => {
      alert("Not authenticated");
    });
  }, []);

  return profile ? (
    <div className="profile-container">
      <h2>Welcome, {profile.user.username}</h2>
      <p>{profile.message}</p>
    </div>
  ) : <p className="profile-container">Loading...</p>;
}
