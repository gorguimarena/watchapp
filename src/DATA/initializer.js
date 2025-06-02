import { conversations } from "./Const";

const baseUsers = [
  { id: 1, name: "Alice", contact: "7816535561" },
  { id: 2, name: "Alice-2", contact: "7816535562" },
  { id: 3, name: "Alice-3", contact: "7816535563" },
  { id: 4, name: "Alice-4", contact: "7816535564" },
  { id: 5, name: "Alice-5", contact: "7816535565" },
];

const users = baseUsers.map((user) => ({
  ...user,
  email: `${user.name.toLowerCase()}@example.com`,
  password: "password123",
}));

function storeUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

const sampleMessages = [
  "Salut {name}, tu vas bien ?",
  "Oui ça va, merci ! Et toi {name} ?",
  "Tu fais quoi de beau aujourd’hui ?",
  "Je bosse sur un projet très cool.",
  "Super ! Tu me montres ?",
  "Quand tu veux, on s'appelle ?",
  "Avec plaisir, dis-moi quand !",
  "À 14h ça te va ?",
  "Parfait, à toute à l'heure !",
  "Bonne soirée {name} !",
  "Merci pour ton aide !",
  "Tu as des nouvelles ?",
  "Je te tiens au courant dès que j'en ai.",
];

function personalizeMessage(template, name) {
  return template.replace("{name}", name);
}

function mergeDuplicateConversations(conversations) {
  const mergedMap = new Map();

  conversations.forEach((conv) => {
    const key = conv.isGroup
      ? `group-${conv.id}`
      : conv.participants
          .slice()
          .sort((a, b) => a - b)
          .join("-");

    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        ...conv,
        messages: [...conv.messages],
      });
    } else {
      const existing = mergedMap.get(key);

      const existingIds = new Set(existing.messages.map((m) => m.id));
      const newMessages = conv.messages.filter((m) => !existingIds.has(m.id));
      existing.messages.push(...newMessages);
    }
  });

  const result = [...mergedMap.values()].map((conv) => {
    conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return conv;
  });

  return result;
}

function generateConversations() {
  const conversations = [];

  for (let i = 0; i < 8; i++) {
    const user1 = users[Math.floor(Math.random() * users.length)];
    let user2 = users[Math.floor(Math.random() * users.length)];

    while (user1.id === user2.id) {
      user2 = users[Math.floor(Math.random() * users.length)];
    }

    const participants = [user1.id, user2.id];
    const messages = [];
    const messageCount = Math.floor(Math.random() * 6) + 5;
    const now = Date.now();

    for (let j = 0; j < messageCount; j++) {
      const sender = j % 2 === 0 ? user1 : user2;
      const recipient = sender.id === user1.id ? user2 : user1;

      const template =
        sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      const content = personalizeMessage(template, recipient.name);

      messages.push({
        id: j + 1 + i * 10,
        senderId: sender.id,
        content,
        timestamp: new Date(now - (messageCount - j) * 3600000).toISOString(),
      });
    }

    conversations.push({
      id: i + 1,
      participants,
      isGroup: false,
      isArchived: false,
      messages,
    });
  }

  return conversations;
}

export function initializeData() {
  storeUsers();

  const saved = localStorage.getItem("conversations");

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error("Conversations corrompues");
    }
  } catch {
    const conversations = mergeDuplicateConversations(generateConversations());
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }
}

