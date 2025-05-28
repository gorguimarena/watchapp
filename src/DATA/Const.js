import { newContact, createGroupForm , populateGroupMembers} from "../components/form";
import { discussionContactsContainer } from "../components/main-disc";
import { createElement } from "../components/components";
import { loadDiscussionWith } from "../components/main-disc";
import { showAddMembersForm } from "../components/form";
import { archive } from "../components/actions";

export const users = JSON.parse(localStorage.getItem('users')) || [];
export const groups = JSON.parse(localStorage.getItem('groups')) || [];
export const conversations = JSON.parse(localStorage.getItem('conversations')) || [];
export let selectedConversationId = null;


localStorage.setItem('conversations', JSON.stringify(
  [
  {
    id: 101,
    participants: [1, 2],
    isGroup: false,
    isArchived: false,
    messages: [
      {
        id: 1,
        senderId: 1,
        content: "Salut Bob, comment ça va ?",
        timestamp: "2025-05-26T08:45:00",
      },
      {
        id: 2,
        senderId: 2,
        content: "Hey Alice ! Ça va super, et toi ?",
        timestamp: "2025-05-26T08:46:10",
      },
      {
        id: 3,
        senderId: 1,
        content: "Je vais bien, merci !",
        timestamp: "2025-05-26T08:47:00",
      },
    ],
  },
  {
    id: 102,
    participants: [1, 3],
    isGroup: false,
    isArchived: true,
    messages: [
      {
        id: 1,
        senderId: 3,
        content: "Tu viens à la réunion tout à l'heure ?",
        timestamp: "2025-05-26T09:00:00",
      },
      {
        id: 2,
        senderId: 1,
        content: "Oui, je serai là à 10h.",
        timestamp: "2025-05-26T09:01:45",
      },
    ],
  },
  {
    id: 103,
    participants: [1, 2, 3],
    isGroup: true,
    name: "Équipe Projet",
    isArchived: false,
    messages: [
      {
        id: 1,
        senderId: 2,
        content: "On commence le projet lundi ?",
        timestamp: "2025-05-25T10:00:00",
      },
      {
        id: 2,
        senderId: 3,
        content: "Oui, c’est bon pour moi.",
        timestamp: "2025-05-25T10:01:30",
      },
      {
        id: 3,
        senderId: 1,
        content: "Parfait, je prépare la doc.",
        timestamp: "2025-05-25T10:02:10",
      },
    ],
  }
]
));


export const infoOptions = [
    {
        icon: 'bi bi-chat-left-fill',
        text: 'Message',
    },
    {
        icon: 'bi bi-microsoft-teams',
        text: 'Groupes',
    },
    {
        icon: 'bi bi-shuffle',
        text: 'Diffusion',
    },
    {
        icon: 'bi bi-calendar-plus-fill',
        text: 'Archives',
    },
    {
        icon: 'bi bi-plus-lg',
        text: 'Nouveau',
    }
];

export const infoActions = [
    {
        icon: 'bi bi-plus-lg',
        color_text: 'text-[#ef6e0f]',
        color_bd: 'border-[#ef6e0f]',
    },
    {
        icon: 'bi bi-archive-fill',
        color_text: 'text-[#837d73]',
        color_bd: 'border-[#837d73]',
    },
    {
        icon: 'bi bi-square-fill',
        color_text: 'text-[#272117]',
        color_bd: 'border-[#272117]',
    },
    {
        icon: 'bi bi-trash',
        color_text: 'text-[#a1040d]',
        color_bd: 'border-[#a1040d]',
    }
];


export const optionHandlers = {
  Message: () => {
    renderContactsList(getDiscussionContacts(), false, false);
  },

  Groupes: () => {
    renderContactsList(getGroupDiscussions(), true, false); 
  },

  Diffusion: () => {
    alert('Diffusion');
  },

  Archives: () => {
    renderContactsList(getArchivedDiscussions(), null ,false, true); 
  },

  Nouveau: () => {
    newContact.style.display = 'flex';
  },
};

export function renderContactsList(list, withGroupButton = false, selectedId = null, showArchived = false) {
  discussionContactsContainer.innerHTML = '';

  if (withGroupButton) {
    populateGroupMembers();
    const addGroupButton = createElement('button', {
      class: [
        'bg-blue-600', 'text-white', 'p-2', 'rounded',
        'font-bold', 'hover:bg-blue-700'
      ],
      onclick: () => {
        createGroupForm.style.display = 'flex';
      }
    }, '➕ Nouveau groupe');

    discussionContactsContainer.appendChild(addGroupButton);
  }

  const elements = list.map(item => {
    const isSelected = selectedId === item.id;
    const wrapperClass = [
      'p-2', 'rounded', 'shadow', 'mb-2', 'flex', 'gap-1',
      'border', 'border-gray-200', 'justify-between', 'cursor-pointer',
      isSelected ? 'bg-blue-100 border-blue-400' : 'bg-white'
    ];
    const names = item.name.split(' ');
    let avatar = names[0].charAt(0).toUpperCase();
    console.log(names);
    
    console.log(names.length);
    
    if (names.length >= 2) {  
      avatar += '-'+names[1].charAt(0).toUpperCase();
    }

    return createElement('div', {
      onClick: () => {
        selectedConversationId = item.conversationId;
        loadDiscussionWith(item.conversationId);
        renderContactsList(list, withGroupButton, item.id, showArchived);
      },
      class: wrapperClass
    }, [
      createElement('div', {
        class: ['p-2', 'flex', 'gap-1', 'items-center']
      }, [
        createElement('span', {
          class: [
            'w-10', 'h-10', 'rounded-full', 'bg-green-500', 'p-2',
            'flex', 'justify-center', 'items-center', 'text-white'
          ]
        },
        avatar
      ),
        createElement('div', {
          class: ['flex', 'flex-col', 'gap-1']
        }, [
          createElement('span', {
            class: ['text-lg', 'font-semibold', 'text-black']
          }, item.name),
          createElement('span', {
            class: ['text-sm', 'text-gray-600']
          }, item.lastMessage)
        ])
      ]),
      createElement('div', {
        class: ['p-2', 'flex', 'flex-col', 'gap-0', 'justify-around', 'items-center', 'relative']
      }, [
        createElement('span', {
          class: ['text-lg', 'font-semibold', 'text-black', 'opacity-50']
        }, item.date),

        showArchived
          ? createElement('i', {
              class: ['bi', 'bi-file-earmark-zip', 'text-xl', 'text-red-500', 'cursor-pointer'],
              onclick: (e) => {
                e.stopPropagation();
                const conv = conversations.find(c => c.id === item.conversationId);
                if (conv) {
                  conv.isArchived = false;
                  localStorage.setItem('conversations', JSON.stringify(conversations));
                  alert('Conversation désarchivée !');
                  renderContactsList(
                    conversations.filter(c => c.isArchived).map(c => ({
                      ...c,
                      id: c.participants.find(pid => pid !== 1),
                      conversationId: c.id,
                      name: users.find(u => u.id === c.participants.find(pid => pid !== 1))?.name || 'Inconnu',
                      lastMessage: c.messages[c.messages.length - 1]?.content || '',
                      date: c.messages[c.messages.length - 1]?.timestamp?.slice(11, 16) || ''
                    })),
                    false,
                    null,
                    true
                  );
                }
              }
            })
          : withGroupButton
          ? createElement('div', {
              class: ['relative']
            }, [
              createElement('i', {
                class: ['bi bi-node-plus-fill', 'text-blue-600', 'text-xl', 'cursor-pointer'],
                onclick: (e) => {
                  e.stopPropagation();
                  showAddMembersForm(item.id);
                }
              })
            ])
          : createElement('span', {
              class: ['w-2', 'h-2', 'rounded-full', 'bg-green-500']
            })
      ])
    ]);
  });

  elements.forEach(el => discussionContactsContainer.appendChild(el));
}

export function getGroupDiscussions(currentUserId = 1) {
  return conversations
    .filter(c => c.isGroup && !c.isArchived && c.participants.includes(currentUserId))
    .map(c => {
      const lastMessage = c.messages[c.messages.length - 1] || {};
      return {
        id: c.id,
        name: c.name,
        lastMessage: lastMessage.content || '',
        date: lastMessage.timestamp?.slice(11, 16) || ''
      };
    });
}

export function getDiscussionContacts(currentUserId = 1) {
  return conversations
    .filter(c => !c.isGroup && !c.isArchived && c.participants.includes(currentUserId))
    .map(c => {
      const otherUserId = c.participants.find(id => id !== currentUserId);
      const user = users.find(u => u.id === otherUserId);
      const lastMessage = c.messages[c.messages.length - 1] || {};
      return {
        id: otherUserId,               
        conversationId: c.id,    
        name: user.name,
        lastMessage: lastMessage.content || '',
        date: lastMessage.timestamp?.slice(11, 16) || ''
      };
    });
}

export function getArchivedDiscussions(currentUserId = 1) {
  return conversations
    .filter(c => c.isArchived && c.participants.includes(currentUserId))
    .map(c => {
      let name = c.name;
      let id = c.id;

      if (!c.isGroup) {
        const otherUserId = c.participants.find(id => id !== currentUserId);
        const user = users.find(u => u.id === otherUserId);
        name = user?.name || 'Inconnu';
        id = otherUserId;
      }

      const lastMessage = c.messages[c.messages.length - 1] || {};
      return {
        id,                        
        conversationId: c.id,   
        name,
        lastMessage: lastMessage.content || '',
        date: lastMessage.timestamp?.slice(11, 16) || ''
      };
    });
}



