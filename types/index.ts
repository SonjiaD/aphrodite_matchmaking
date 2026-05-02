export interface Prompt {
  question: string;
  answer: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  distance: string;
  photos: string[];
  prompts: Prompt[];
  interests: string[];
  lookingFor: string;
}

export interface Spark {
  id: string;
  cupidId: string;
  dater1Id: string;
  dater2Id: string;
  note: string;
  vibe: 'casual' | 'strong' | 'soulmates';
  status: 'pending' | 'accepted' | 'declined';
  outcome?: 'matched' | 'dated' | 'second_date';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export interface Match {
  id: string;
  spark: Spark;
  chatThread: Message[];
}

export interface CupidStats {
  userId: string;
  totalSparks: number;
  successfulSparks: number;
  successRate: number;
  streak: number;
  rank: number;
  badges: string[];
  points: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  stats: CupidStats;
}

export interface IncomingSpark {
  id: string;
  suggestedUser: User;
  cupidName: string;
  note: string;
  vibe: 'casual' | 'strong' | 'soulmates';
  aiVerified?: boolean;
  accepted?: boolean;
}
