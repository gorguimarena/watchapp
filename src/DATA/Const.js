import {
  newContact,
  createGroupForm,
  populateGroupMembers,
  diffusionChamps
} from "../components/form";
import { discussionContactsContainer } from "../components/main-disc";
import { createElement } from "../components/components";
import { loadDiscussionWith } from "../components/main-disc";
import { showAddMembersForm } from "../components/form";
import { initializeData } from "./initializer";


export let selectedUserId = null;
export let idUser = JSON.parse(localStorage.getItem("idUser")) || null;
export let users = JSON.parse(localStorage.getItem("users")) || [];
export let groups = JSON.parse(localStorage.getItem("groups")) || [];
export let conversations =
  JSON.parse(localStorage.getItem("conversations")) || [];
export let selectedConversationId = null;

export function setUserId(newId) {
  idUser = newId;
}
export function setSelectedConversationId(newId) {
  selectedConversationId = newId;
}

initializeData();

localStorage.setItem(
  "groups",
  JSON.stringify([
    {
      id: 1,
      name: "Équipe Projet",
      members: [1, 2, 3],
    },
    {
      id: 2,
      name: "Équipe Marketing",
      members: [1, 4],
    },
  ])
);

export const infoOptions = [
  {
    icon: "bi bi-chat-left-fill",
    text: "Message",
  },
  {
    icon: "bi bi-microsoft-teams",
    text: "Groupes",
  },
  {
    icon: "bi bi-shuffle",
    text: "Diffusion",
  },
  {
    icon: "bi bi-calendar-plus-fill",
    text: "Archives",
  },
  {
    icon: "bi bi-plus-lg",
    text: "Nouveau",
  },
  {
    icon: "bi bi-arrow-bar-left",
    text: "Deconnexion",
  }
];

export const infoActions = [
  {
    icon: "bi bi-plus-lg",
    color_text: "text-[#ef6e0f]",
    color_bd: "border-[#ef6e0f]",
  },
  {
    icon: "bi bi-archive-fill",
    color_text: "text-[#837d73]",
    color_bd: "border-[#837d73]",
  },
  {
    icon: "bi bi-square-fill",
    color_text: "text-[#272117]",
    color_bd: "border-[#272117]",
  },
  {
    icon: "bi bi-trash",
    color_text: "text-[#a1040d]",
    color_bd: "border-[#a1040d]",
  },
];

export const optionHandlers = {
  Message: () => {
    renderContactsList(getDiscussionContacts(idUser), false, false);
  },

  Groupes: () => {
    renderContactsList(getGroupDiscussions(idUser), true, false);
  },

  Diffusion: () => {
    diffusionChamps.style.display = "flex";
  },

  Archives: () => {
    renderContactsList(getArchivedDiscussions(idUser), null, false, true);
  },

  Nouveau: () => {
    newContact.style.display = "flex";
  },
  Deconnexion: () => {
    idUser = null;
    location.reload();
  }
};

export function renderContactsList(
  list,
  withGroupButton = false,
  selectedId = null,
  showArchived = false
) {
  discussionContactsContainer.innerHTML = "";

  if (withGroupButton) {
    populateGroupMembers();
    const addGroupButton = createElement(
      "button",
      {
        class: [
          "bg-blue-600",
          "text-white",
          "p-2",
          "rounded",
          "font-bold",
          "hover:bg-blue-700",
        ],
        onclick: () => {
          createGroupForm.style.display = "flex";
        },
      },
      "➕ Nouveau groupe"
    );

    discussionContactsContainer.appendChild(addGroupButton);
  }

  const elements = list.map((item) => {
    const isSelected = selectedId === item.id;

    const wrapperClass = [
      "p-2",
      "rounded",
      "shadow",
      "mb-2",
      "flex",
      "gap-1",
      "border",
      "border-gray-200",
      "justify-between",
      "cursor-pointer",
      isSelected ? "bg-blue-100 border-blue-400" : "bg-white",
    ];
    const names = item.name.split(" ");
    let avatar = names[0].charAt(0).toUpperCase();
    console.log(names);

    console.log(names.length);

    if (names.length >= 2) {
      avatar += "-" + names[1].charAt(0).toUpperCase();
    }

    return createElement(
      "div",
      {
        onClick: () => {
          selectedConversationId = item.conversationId;
          selectedUserId = item.id;
          loadDiscussionWith(item.conversationId, idUser);
          renderContactsList(list, withGroupButton, item.id, showArchived);
        },
        class: wrapperClass,
      },
      [
        createElement(
          "div",
          {
            class: ["p-2", "flex", "gap-1", "items-center"],
          },
          [
            createElement(
              "span",
              {
                class: [
                  "w-10",
                  "h-10",
                  "rounded-full",
                  "bg-green-500",
                  "p-2",
                  "flex",
                  "justify-center",
                  "items-center",
                  "text-white",
                ],
              },
              avatar
            ),
            createElement(
              "div",
              {
                class: ["flex", "flex-col", "gap-1"],
              },
              [
                createElement(
                  "span",
                  {
                    class: ["text-lg", "font-semibold", "text-black"],
                  },
                  item.name
                ),
                createElement(
                  "span",
                  {
                    class: ["text-sm", "text-gray-600"],
                  },
                  item.lastMessage
                ),
              ]
            ),
          ]
        ),
        createElement(
          "div",
          {
            class: [
              "p-2",
              "flex",
              "flex-col",
              "gap-0",
              "justify-around",
              "items-center",
              "relative",
            ],
          },
          [
            createElement(
              "span",
              {
                class: ["text-lg", "font-semibold", "text-black", "opacity-50"],
              },
              item.date
            ),

            showArchived
              ? createElement("i", {
                  class: [
                    "bi",
                    "bi-file-earmark-zip",
                    "text-xl",
                    "text-red-500",
                    "cursor-pointer",
                  ],
                  onclick: (e) => {
                    e.stopPropagation();
                    const conv = conversations.find(
                      (c) => c.id === item.conversationId
                    );
                    if (conv) {
                      conv.isArchived = false;
                      localStorage.setItem(
                        "conversations",
                        JSON.stringify(conversations)
                      );
                      renderContactsList(
                        conversations
                          .filter((c) => c.isArchived)
                          .map((c) => ({
                            ...c,
                            id: c.participants.find((pid) => pid !== 1),
                            conversationId: c.id,
                            name:
                              users.find(
                                (u) =>
                                  u.id ===
                                  c.participants.find((pid) => pid !== 1)
                              )?.name || "Inconnu",
                            lastMessage:
                              c.messages[c.messages.length - 1]?.content || "",
                            date:
                              c.messages[
                                c.messages.length - 1
                              ]?.timestamp?.slice(11, 16) || "",
                          })),
                        false,
                        null,
                        true
                      );
                    }
                  },
                })
              : withGroupButton
              ? createElement(
                  "div",
                  {
                    class: ["relative", "flex", "gap-3"],
                  },
                  [
                    createElement("i", {
                      class: [
                        "bi bi-node-plus-fill",
                        "text-blue-600",
                        "text-xl",
                        "cursor-pointer",
                      ],
                      onclick: (e) => {
                        e.stopPropagation();
                        showAddMembersForm(item.id);
                      },
                    }),
                    createElement("i", {
                      class: [
                        "bi bi-transparency",
                        "text-blue-600",
                        "text-xl",
                        "cursor-pointer",
                      ],
                      onclick: (e) => {
                        e.stopPropagation();
                        showMembersForm(item.id);
                      },
                    }),
                  ]
                )
              : createElement("span", {
                  class: ["w-2", "h-2", "rounded-full", "bg-green-500"],
                }),
          ]
        ),
      ]
    );
  });

  elements.forEach((el) => discussionContactsContainer.appendChild(el));
}

export function getGroupDiscussions(currentUserId = 1) {
  return conversations
    .filter(
      (c) =>
        c.isGroup && !c.isArchived && c.participants.includes(currentUserId)
    )
    .map((c) => {
      const lastMessage = c.messages[c.messages.length - 1] || {};
      return {
        id: c.id,
        name: c.name,
        lastMessage: lastMessage.content || "",
        date: lastMessage.timestamp?.slice(11, 16) || "",
      };
    });
}

export function getDiscussionContacts(idUser = 1) {
  const discussionIds = conversations
    .filter(
      (c) =>
        !c.isGroup &&
        c.participants.includes(idUser) &&
        !c.isArchived
    )
    .map((c) => {
      const otherId = c.participants.find((id) => id !== idUser);
      return { convo: c, otherId };
    });

  return discussionIds
    .map(({ convo, otherId }) => {
      const user = users.find((u) => u.id === otherId);
      if (!user) return null;

      const lastMsg = convo.messages.at(-1);

      return {
        id: user.id,
        name: user.name,
        contact: user.contact,
        conversationId: convo.id,
        lastMessage: lastMsg ? lastMsg.content : "",
        date: lastMsg ? lastMsg.timestamp?.slice(11, 16) : "",
      };
    })
    .filter(Boolean); 
}


export function getArchivedDiscussions(currentUserId = 1) {
  return conversations
    .filter((c) => c.isArchived && c.participants.includes(currentUserId))
    .map((c) => {
      let name = c.name;
      let id = c.id;

      if (!c.isGroup) {
        const otherUserId = c.participants.find((id) => id !== currentUserId);
        const user = users.find((u) => u.id === otherUserId);
        name = user?.name || "Inconnu";
        id = otherUserId;
      }

      const lastMessage = c.messages[c.messages.length - 1] || {};
      return {
        id,
        conversationId: c.id,
        name,
        lastMessage: lastMessage.content || "",
        date: lastMessage.timestamp?.slice(11, 16) || "",
      };
    });
}

export function showMembersForm(groupId) {
  const group = conversations.find((g) => g.id === groupId && g.isGroup);
  if (!group) return alert("Groupe introuvable.");

  groupMembersList.innerHTML = "";

  users.forEach((user) => {
    const isAdmin = group.admins.includes(user.id);

    const button = createElement(
      "button",
      {
        class: [
          "text-sm",
          "px-2",
          "py-1",
          "rounded",
          isAdmin
            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
            : "bg-blue-500 text-white hover:bg-blue-600",
        ],
        onclick: () => {
          const isNowAdmin = !isAdmin;
          updateRole(user.id, isNowAdmin);

          showMembersForm(groupId);
        },
      },
      isAdmin ? "Mettre utilisateur simple" : "Faire admin"
    );

    const label = createElement(
      "div",
      {
        class: ["flex", "items-center", "justify-between", "py-2", "border-b"],
      },
      [createElement("span", { class: "text-gray-800" }, user.name), button]
    );

    groupMembersList.appendChild(label);
  });

  listMembers.style.display = "flex";

  function updateRole(userId, isNowAdmin) {
    if (isNowAdmin) {
      if (!group.admins.includes(userId)) group.admins.push(userId);
    } else {
      group.admins = group.admins.filter((id) => id !== userId);
    }

    const index = conversations.findIndex((conv) => conv.id === group.id);
    if (index !== -1) conversations[index] = group;
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }
}

export const groupMembersList = createElement("div", {
  class: [
    "w-full",
    "max-h-80",
    "overflow-y-auto",
    "bg-white",
    "rounded",
    "p-2",
    "flex",
    "flex-col",
    "gap-2",
  ],
});

export const listMembers = createElement(
  "div",
  {
    class: [
      "p-20",
      "absolute",
      "top-0",
      "left-0",
      "h-screen",
      "w-full",
      "bg-black",
      "z-50",
      "flex",
      "flex-col",
      "gap-2",
      "items-center",
      "justify-center",
      "opacity-80",
    ],
    vShow: false,
  },
  [
    groupMembersList,
    createElement(
      "button",
      {
        class: [
          "bg-blue-500",
          "text-white",
          "px-4",
          "py-2",
          "rounded",
          "mt-4",
          "hover:bg-blue-600",
        ],
        onclick: () => {
          listMembers.style.display = "none";
        },
      },
      "Fermer"
    ),
  ]
);
