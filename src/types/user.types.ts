export type User = {
  userId: string;
  name: string;
  email: string;
  firebaseTokens?: string[];
  profilePic?: string;
  lastLogin?: Date;
  createdAt: Date;
  isActive: boolean;
};
