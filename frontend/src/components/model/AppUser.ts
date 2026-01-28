import type {UserRole} from "./UserRole.ts";

export type AppUser = {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    githubUrl: string;
    preferredLanguage: string;
    role: UserRole;
    favoriteRealEstates: string[];
};