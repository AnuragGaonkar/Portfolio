// ProfilePage.jsx
import React from "react";
import ProfileCard from "./ProfileCard.jsx";

function ProfilePage() {
  return (
    <section className="page profile-page transition-shell">
      <div className="profile-page-inner">
        <ProfileCard
          avatarUrl="/profile.png"
          miniAvatarUrl="/profile.png"
          name="Anurag Gaonkar"
          title="AI & Full‑Stack Engineer"
          handle="anuraggaonkar"
          status="Exploring new quests"
          enableTilt={true}
          enableMobileTilt={true}
          showUserInfo={false}
        />
      </div>
    </section>
  );
}

export default ProfilePage;
