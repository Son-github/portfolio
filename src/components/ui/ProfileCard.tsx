import Image from "next/image";
import { heroProfile } from "@/data/hero";

/** 프레임/노치/조명은 실제 CSS, 교체 가능한 일러스트만 이미지입니다. */
export function ProfileCard() {
  return (
    <div className="hero-profile-position">
      <div className="hero-profile-float">
        <div className="hero-profile-card">
          <span className="hero-profile-notch" aria-hidden="true" />
          <div className="hero-profile-image">
            <Image
              src={heroProfile.avatar}
              alt={heroProfile.avatarAlt}
              width={768}
              height={768}
              sizes="(max-width: 767px) 180px, 320px"
              priority
            />
          </div>
          <div className="hero-profile-caption">
            <p>{heroProfile.name}</p>
            <span>{heroProfile.role}</span>
          </div>
          <span className="hero-profile-seal" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
