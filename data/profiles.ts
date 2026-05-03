import { User } from '../types';

const img = (id: string, w = 600, h = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=85`;

export const profiles: User[] = [
  {
    id: '1',
    name: 'Maya',
    age: 26,
    distance: '2 mi away',
    photos: [img('photo-1514888286974-6c03e2ca1dba')],
    prompts: [
      { question: 'The way to my heart is', answer: 'A really good taco spot and knowing all the lyrics to a Mitski album' },
      { question: "I'm looking for", answer: "Someone genuinely curious about the world. Let's get lost in a bookstore together" },
    ],
    interests: ['Music', 'Books', 'Tacos', 'Yoga', 'Art'],
    lookingFor: 'Something real',
  },
  {
    id: '2',
    name: 'Jordan',
    age: 28,
    distance: '4 mi away',
    photos: [img('photo-1587300003388-59208cc962cb')],
    prompts: [
      { question: 'My ideal Sunday', answer: 'Farmers market in the morning, long bike ride, cooking something ambitious for dinner' },
      { question: 'A random fact I love', answer: "Otters hold hands while sleeping so they don't drift apart. I aspire to this." },
    ],
    interests: ['Cycling', 'Cooking', 'Surfing', 'Music', 'Plants'],
    lookingFor: 'Long-term relationship',
  },
  {
    id: '3',
    name: 'Priya',
    age: 25,
    distance: '1 mi away',
    photos: [img('photo-1474511320723-9a56873867b5')],
    prompts: [
      { question: 'Controversial opinion', answer: "Brunch is overrated, let's just do dinner and have a real conversation" },
      { question: 'I geek out on', answer: 'Documentary rabbit holes, obscure history, and why cities are designed the way they are' },
    ],
    interests: ['Urban Design', 'Film', 'Books', 'Coffee', 'Music'],
    lookingFor: 'Something real',
  },
  {
    id: '4',
    name: 'Eli',
    age: 27,
    distance: '6 mi away',
    photos: [img('photo-1561037404-61cd46aa615b')],
    prompts: [
      { question: "I'm weirdly good at", answer: "Spotting the best seat in any restaurant and remembering every conversation we've ever had" },
      { question: "The best trip I've taken", answer: 'Drove the Pacific Coast Highway alone with no playlist, just windows down' },
    ],
    interests: ['Road Trips', 'Music', 'Surfing', 'Cooking', 'Dogs'],
    lookingFor: 'Long-term relationship',
  },
  {
    id: '5',
    name: 'Sofia',
    age: 24,
    distance: '3 mi away',
    photos: [img('photo-1585110396000-c9ffd4e4b308')],
    prompts: [
      { question: "A skill I'm working on", answer: 'Making my apartment feel like a place someone would want to stay forever' },
      { question: "You'll know I like you if", answer: 'I text you a random article at 11pm because it reminded me of something you said' },
    ],
    interests: ['Art', 'Yoga', 'Books', 'Tacos', 'Music'],
    lookingFor: 'Something real',
  },
  {
    id: '6',
    name: 'Marcus',
    age: 29,
    distance: '5 mi away',
    photos: [img('photo-1548366086-7f1b76106622')],
    prompts: [
      { question: 'Two truths and a lie', answer: "I've been to 14 countries, I can juggle, I've never seen The Office" },
      { question: 'My love language', answer: "Quality time and acts of service. I'll fix your bike and then we can ride somewhere new" },
    ],
    interests: ['Cycling', 'Travel', 'Cooking', 'Surfing', 'Music'],
    lookingFor: 'Long-term relationship',
  },
  {
    id: '7',
    name: 'Zoe',
    age: 26,
    distance: '2 mi away',
    photos: [img('photo-1583337130417-3346a1be7dee')],
    prompts: [
      { question: 'I go crazy for', answer: "Discovering a coffee shop that becomes 'our spot'. I'm a creature of beautiful habits" },
      { question: 'Change my mind', answer: 'Afternoon dates are better than dinner dates every single time' },
    ],
    interests: ['Coffee', 'Running', 'Art', 'Yoga', 'Books'],
    lookingFor: 'Something real',
  },
  {
    id: '8',
    name: 'Kai',
    age: 27,
    distance: '7 mi away',
    photos: [img('photo-1425082661705-1834bfd09dca')],
    prompts: [
      { question: "On weekends you'll find me", answer: "At the farmers market, then pretending I'm going to cook something elaborate and ordering pizza instead" },
      { question: "I'm looking for someone who", answer: 'Laughs at my dumb jokes but can also sit in comfortable silence with me' },
    ],
    interests: ['Tacos', 'Music', 'Cycling', 'Dogs', 'Surfing'],
    lookingFor: 'Long-term relationship',
  },
];

export function getProfilePairs(): [User, User][] {
  const pairs: [User, User][] = [];
  for (let i = 0; i < profiles.length - 1; i += 2) {
    pairs.push([profiles[i], profiles[i + 1]]);
  }
  return pairs;
}
