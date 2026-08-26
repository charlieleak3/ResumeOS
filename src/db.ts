import { UserProfile, MasterRepository, ResumeSnapshot } from './types';

export class LocalProfileDatabase {
  public static saveProfile(profile: UserProfile, blocks: any[]): void {
    localStorage.setItem(`profile_${profile.id}`, JSON.stringify({ profile, blocks }));
  }

  public static loadProfile(profileId: string): { profile: UserProfile; blocks: any[] } | null {
    const data = localStorage.getItem(`profile_${profileId}`);
    return data ? JSON.parse(data) : null;
  }
}
