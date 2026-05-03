import { IncomingSpark } from '../types';
import { profiles } from './profiles';

export const incomingSparks: IncomingSpark[] = [
  {
    id: 's1',
    suggestedUser: profiles[1],
    cupidName: 'Aria K.',
    note: 'You both love Sunday farmers markets and cooking, and Jordan mentioned wanting someone to try new recipes with.',
    vibe: 'strong',
    aiVerified: true,
  },
  {
    id: 's2',
    suggestedUser: profiles[5],
    cupidName: 'Dev R.',
    note: "Marcus has been to 14 countries and you mentioned wanting to travel more. Plus you both have serious music taste.",
    vibe: 'casual',
    aiVerified: true,
  },
  {
    id: 's3',
    suggestedUser: profiles[7],
    cupidName: 'Lena M.',
    note: "Kai is low-key and genuine, you seem the same way. That \"comfortable silence\" energy. I think you'd actually just get each other.",
    vibe: 'soulmates',
    aiVerified: false,
  },
  {
    id: 's4',
    suggestedUser: profiles[3],
    cupidName: 'Sam T.',
    note: "Eli's Pacific Coast Highway solo drive, your love of spontaneous adventures. Pretty sure you'd disappear on a road trip together.",
    vibe: 'strong',
    aiVerified: true,
  },
];
