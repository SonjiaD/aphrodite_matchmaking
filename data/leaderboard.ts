import { LeaderboardEntry } from '../types';

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=100&h=100&fit=crop&crop=faces&auto=format&q=80`;

export const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: 'c1', name: 'Aria K.', age: 27, distance: '', photos: [img('photo-1531746020798-e6953c6e8e04')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c1', totalSparks: 48, successfulSparks: 31, successRate: 65, streak: 7, rank: 1, badges: ['Cupid Elite', 'Hot Streak', 'Soulmaker'], points: 1840 },
  },
  {
    rank: 2,
    user: { id: 'c2', name: 'Dev R.', age: 30, distance: '', photos: [img('photo-1500648767791-00dcc994a43e')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c2', totalSparks: 42, successfulSparks: 26, successRate: 62, streak: 5, rank: 2, badges: ['Top Cupid', 'Hot Streak'], points: 1560 },
  },
  {
    rank: 3,
    user: { id: 'c3', name: 'Lena M.', age: 25, distance: '', photos: [img('photo-1544005313-94ddf0286df2')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c3', totalSparks: 39, successfulSparks: 22, successRate: 56, streak: 4, rank: 3, badges: ['Top Cupid', 'Soulmaker'], points: 1320 },
  },
  {
    rank: 4,
    user: { id: 'c4', name: 'Sam T.', age: 28, distance: '', photos: [img('photo-1492562080023-ab3db95bfbce')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c4', totalSparks: 33, successfulSparks: 18, successRate: 55, streak: 3, rank: 4, badges: ['First Spark', 'Hot Streak'], points: 1080 },
  },
  {
    rank: 5,
    user: { id: 'c5', name: 'Nina P.', age: 26, distance: '', photos: [img('photo-1438761681033-6461ffad8d80')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c5', totalSparks: 28, successfulSparks: 14, successRate: 50, streak: 2, rank: 5, badges: ['First Spark'], points: 840 },
  },
  {
    rank: 6,
    user: { id: 'c6', name: 'Chris B.', age: 31, distance: '', photos: [img('photo-1507003211169-0a1dd7228f2d')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c6', totalSparks: 22, successfulSparks: 10, successRate: 45, streak: 1, rank: 6, badges: ['First Spark'], points: 620 },
  },
  {
    rank: 7,
    user: { id: 'c7', name: 'Jade W.', age: 24, distance: '', photos: [img('photo-1517841905240-472988babdf9')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c7', totalSparks: 18, successfulSparks: 8, successRate: 44, streak: 1, rank: 7, badges: ['First Spark'], points: 490 },
  },
  {
    rank: 8,
    user: { id: 'c8', name: 'Omar S.', age: 29, distance: '', photos: [img('photo-1552374196-c4e7ffc6e126')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c8', totalSparks: 14, successfulSparks: 5, successRate: 36, streak: 0, rank: 8, badges: ['First Spark'], points: 310 },
  },
];
