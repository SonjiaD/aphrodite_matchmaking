import { LeaderboardEntry } from '../types';

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=100&h=100&fit=crop&crop=center&auto=format&q=80`;

export const leaderboardWeekly: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: 'w1', name: 'Mia L.', age: 24, distance: '', photos: [img('photo-1543549790-8b5f4a028cfb')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w1', totalSparks: 9, successfulSparks: 7, successRate: 78, streak: 3, rank: 1, badges: ['Hot Streak', 'Rising Star'], points: 380 },
  },
  {
    rank: 2,
    user: { id: 'w2', name: 'Jake R.', age: 26, distance: '', photos: [img('photo-1530595467537-0b5996c41f2d')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w2', totalSparks: 8, successfulSparks: 5, successRate: 63, streak: 2, rank: 2, badges: ['Hot Streak'], points: 310 },
  },
  {
    rank: 3,
    user: { id: 'w3', name: 'Yuki S.', age: 25, distance: '', photos: [img('photo-1573865526537-6f87515d8a27')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w3', totalSparks: 7, successfulSparks: 4, successRate: 57, streak: 1, rank: 3, badges: ['Soulmaker'], points: 260 },
  },
  {
    rank: 4,
    user: { id: 'w4', name: 'Aria K.', age: 27, distance: '', photos: [img('photo-1564349683136-77e08dba1ef7')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w4', totalSparks: 6, successfulSparks: 4, successRate: 67, streak: 2, rank: 4, badges: ['Top Cupid'], points: 240 },
  },
  {
    rank: 5,
    user: { id: 'w5', name: 'Dev R.', age: 30, distance: '', photos: [img('photo-1548366086-7f1b76106622')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w5', totalSparks: 5, successfulSparks: 3, successRate: 60, streak: 1, rank: 5, badges: ['Top Cupid'], points: 200 },
  },
  {
    rank: 6,
    user: { id: 'w6', name: 'Lena M.', age: 25, distance: '', photos: [img('photo-1425082661705-1834bfd09dca')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w6', totalSparks: 4, successfulSparks: 2, successRate: 50, streak: 0, rank: 6, badges: ['First Spark'], points: 140 },
  },
  {
    rank: 7,
    user: { id: 'w7', name: 'Sam T.', age: 28, distance: '', photos: [img('photo-1583337130417-3346a1be7dee')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w7', totalSparks: 3, successfulSparks: 1, successRate: 33, streak: 0, rank: 7, badges: ['First Spark'], points: 90 },
  },
  {
    rank: 8,
    user: { id: 'w8', name: 'Nina P.', age: 26, distance: '', photos: [img('photo-1585110396000-c9ffd4e4b308')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'w8', totalSparks: 2, successfulSparks: 1, successRate: 50, streak: 0, rank: 8, badges: ['First Spark'], points: 70 },
  },
];

export const leaderboardAllTime: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: 'c1', name: 'Aria K.', age: 27, distance: '', photos: [img('photo-1564349683136-77e08dba1ef7')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c1', totalSparks: 48, successfulSparks: 31, successRate: 65, streak: 7, rank: 1, badges: ['Cupid Elite', 'Hot Streak', 'Soulmaker'], points: 1840 },
  },
  {
    rank: 2,
    user: { id: 'c2', name: 'Dev R.', age: 30, distance: '', photos: [img('photo-1548366086-7f1b76106622')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c2', totalSparks: 42, successfulSparks: 26, successRate: 62, streak: 5, rank: 2, badges: ['Top Cupid', 'Hot Streak'], points: 1560 },
  },
  {
    rank: 3,
    user: { id: 'c3', name: 'Lena M.', age: 25, distance: '', photos: [img('photo-1425082661705-1834bfd09dca')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c3', totalSparks: 39, successfulSparks: 22, successRate: 56, streak: 4, rank: 3, badges: ['Top Cupid', 'Soulmaker'], points: 1320 },
  },
  {
    rank: 4,
    user: { id: 'c4', name: 'Sam T.', age: 28, distance: '', photos: [img('photo-1583337130417-3346a1be7dee')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c4', totalSparks: 33, successfulSparks: 18, successRate: 55, streak: 3, rank: 4, badges: ['First Spark', 'Hot Streak'], points: 1080 },
  },
  {
    rank: 5,
    user: { id: 'c5', name: 'Nina P.', age: 26, distance: '', photos: [img('photo-1585110396000-c9ffd4e4b308')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c5', totalSparks: 28, successfulSparks: 14, successRate: 50, streak: 2, rank: 5, badges: ['First Spark'], points: 840 },
  },
  {
    rank: 6,
    user: { id: 'c6', name: 'Mia L.', age: 24, distance: '', photos: [img('photo-1543549790-8b5f4a028cfb')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c6', totalSparks: 22, successfulSparks: 11, successRate: 50, streak: 3, rank: 6, badges: ['Rising Star'], points: 720 },
  },
  {
    rank: 7,
    user: { id: 'c7', name: 'Jake R.', age: 26, distance: '', photos: [img('photo-1530595467537-0b5996c41f2d')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c7', totalSparks: 18, successfulSparks: 8, successRate: 44, streak: 2, rank: 7, badges: ['First Spark'], points: 490 },
  },
  {
    rank: 8,
    user: { id: 'c8', name: 'Yuki S.', age: 25, distance: '', photos: [img('photo-1573865526537-6f87515d8a27')], prompts: [], interests: [], lookingFor: '' },
    stats: { userId: 'c8', totalSparks: 14, successfulSparks: 6, successRate: 43, streak: 1, rank: 8, badges: ['Soulmaker'], points: 380 },
  },
];
