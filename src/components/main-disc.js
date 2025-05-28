import { users, conversations } from "../DATA/Const";
import { createElement } from "./components";
import { discussionChamp } from "./discussion";

export let selectedDiscussion = {
  contact: null,
  messages: [],
};

export function discussionPArt(messages, currentUserId = 1) {
  return messages.map(msg => {
    const isMine = msg.senderId === currentUserId;
    return createElement('div', {
      class: [
        'max-w-[70%]',
        'p-2',
        'rounded-xl',
        isMine ? 'bg-green-500 text-white self-end' : 'bg-white text-black self-start',
        'shadow',
        'text-sm'
      ]
    }, msg.content);
  });
}


export function loadDiscussionWith(conversationId, currentUserId = 1) {
  const convo = conversations.find(c => c.id === conversationId);

  if (!convo) {
    selectedDiscussion.messages = [];
    discussionChamp.innerHTML = '';
    return;
  }

  if (convo.isGroup) {
    selectedDiscussion.contact = { id: convo.id, name: convo.name };
  } else {
    const otherUserId = convo.participants.find(id => id !== currentUserId);
    const contact = users.find(u => u.id === otherUserId);
    selectedDiscussion.contact = contact;
  }

  selectedDiscussion.messages = convo.messages;
  discussionChamp.innerHTML = '';

  const messagesNodes = discussionPArt(selectedDiscussion.messages, currentUserId);
  messagesNodes.forEach(node => discussionChamp.appendChild(node));
}

export const currentUserId = 1;

export function getDiscussionContacts() {
  const contacts = [];

  conversations.forEach(convo => {
    if (!convo.participants.includes(currentUserId)) return;

    const contactId = convo.participants.find(id => id !== currentUserId);
    const user = users.find(u => u.id === contactId);

    if (!user) return;

    const lastMessageObj = convo.messages[convo.messages.length - 1];
    const lastMessage = lastMessageObj?.content || "";
    const date = new Date(lastMessageObj?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    contacts.push({
      id: user.id,
      name: user.name,
      contact: user.contact,
      lastMessage: lastMessage,
      date: date
    });
  });

  return contacts;
}

export const discussionContactsContainer = createElement('div', {
  id: 'discussion-contacts-container',
  class: ['w-full', 'p-1', 'flex', 'flex-col', 'gap-2']
});

const inputSearch = createElement('input', {
                    class: [
                        'w-full',
                        'bg-white',
                        'border-none',
                        'outline-none',
                        'rounded-md',
                        'p-2',
                        'mt-2',
                    ],
                    placeholder: 'Rechercher',
                    type: 'text',
            })

export const main = createElement('div', {
    class: [
        'bg-[#f8f6f5]',
        'h-full',
        'flex-[2_1_0%]',
        'p-2'
    ],
},
[
    createElement('div', {
        class: [
            'w-full',
            'h-24',
        ],
    },
    [
        createElement('h1',{
            class: [
                'text-black',
                'font-bold',
                'text-2xl',
            ],
        },
            'Discussions'
        ),
        createElement('form',{
            class: [
                'w-full',
                'h-1',
            ],
        },
            inputSearch
        )
    ]
    ),
    discussionContactsContainer,
]
);