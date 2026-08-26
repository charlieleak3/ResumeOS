import { UserProfile, MasterRepository, ResumeSnapshot } from '../shared/types';
import * as fs from 'fs';
import * as path from 'path';

export class LocalProfileDatabase {
  private baseDir: string;

  constructor(appDataPath: string) {
    this.baseDir = path.join(appDataPath, 'ResumeOS_Profiles');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getProfilePath(profileId: string): string {
    return path.join(this.baseDir, `${profileId}.json`);
  }

  public saveProfileData(profileId: string, profile: UserProfile, repository: MasterRepository, snapshots: ResumeSnapshot[]): void {
    const data = { profile, repository, snapshots };
    fs.writeFileSync(this.getProfilePath(profileId), JSON.stringify(data, null, 2), 'utf-8');
  }

  public loadProfileData(profileId: string): { profile: UserProfile; repository: MasterRepository; snapshots: ResumeSnapshot[] } | null {
    const filePath = this.getProfilePath(profileId);
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  public listProfiles(): string[] {
    if (!fs.existsSync(this.baseDir)) return [];
    return fs.readdirSync(this.baseDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  }
}