export interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  s1: [
    { id: '1', fromMe: false, text: "Hey! Aria said we'd get along. She was right lol", time: '2h ago' },
    { id: '2', fromMe: true,  text: "Haha I had the same thought when I saw your profile", time: '2h ago' },
    { id: '3', fromMe: false, text: "The farmers market thing? That is literally my Sunday routine", time: '1h ago' },
    { id: '4', fromMe: true,  text: "Ok we have to go. This weekend?", time: '45m ago' },
    { id: '5', fromMe: false, text: "I am so down. The one on 5th is the best", time: '30m ago' },
  ],
  s2: [
    { id: '1', fromMe: false, text: "Dev has good taste I'll give them that", time: '3h ago' },
    { id: '2', fromMe: true,  text: "Right? 14 countries... that is wild", time: '3h ago' },
    { id: '3', fromMe: false, text: "Ha yeah. The juggling one I am still working on", time: '2h ago' },
    { id: '4', fromMe: true,  text: "Wait is that the lie?", time: '2h ago' },
    { id: '5', fromMe: false, text: "You will have to figure that out in person", time: '1h ago' },
  ],
  s3: [
    { id: '1', fromMe: false, text: "Lena really did her research huh", time: '5h ago' },
    { id: '2', fromMe: true,  text: "Comfortable silence test: ready?", time: '4h ago' },
    { id: '3', fromMe: false, text: "...", time: '4h ago' },
    { id: '4', fromMe: true,  text: "...", time: '3h ago' },
    { id: '5', fromMe: false, text: "Ok yeah this works. Coffee sometime?", time: '2h ago' },
  ],
  s4: [
    { id: '1', fromMe: false, text: "Sam said spontaneous adventures. Does that mean right now?", time: '1h ago' },
    { id: '2', fromMe: true,  text: "Give me 10 minutes lol", time: '58m ago' },
    { id: '3', fromMe: false, text: "PCH?", time: '55m ago' },
    { id: '4', fromMe: true,  text: "Obviously. Windows down, no playlist", time: '50m ago' },
  ],
};
