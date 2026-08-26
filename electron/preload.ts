import { contextBridge, ipcRenderer } from 'electron';
import { UserProfile, MasterRepository, ResumeSnapshot } from '../src/shared/types';

contextBridge.exposeInMainWorld('resumeOS', {
  loadProfile: (profileId: string) => ipcRenderer.invoke('load-profile', profileId),
  saveProfile: (data: {
    profileId: string;
    profile: UserProfile;
    repository: MasterRepository;
    snapshots: ResumeSnapshot[];
  }) => ipcRenderer.invoke('save-profile', data),
});