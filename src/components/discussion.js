import { createElement } from "./components";
import { archive } from "./actions";
import { loadDiscussionWith } from "./main-disc";
import {
  conversations,
  selectedConversationId,
  idUser,
  selectedUserId,
  setSelectedConversationId,
  renderContactsList,
  getDiscussionContacts
} from "../DATA/Const";
import {
  deleteConversation,
  deleteDiscussion,
  blocConversation,
} from "./actions";

export const discussionChamp = createElement("div", {
  id: "discussion-champ",
  class: [
    "w-full",
    "overflow-y-auto",
    "p-2",
    "flex",
    "flex-col",
    "gap-2",
    "flex-[8_1%]",
    "bg-[#eee7d6]",
  ],
});

export const messageInput = createElement(
  "form",
  {
    class: ["flex-[14_1_0%]"],
    onsubmit: (e) => {
      e.preventDefault();

      const input = e.target.querySelector("input");
      const content = input.value.trim();
      if (!content) return;

      let convo = conversations.find((c) => c.id === selectedConversationId);

      if (!convo && selectedConversationId === null && selectedUserId) {
        convo = conversations.find(
          (c) =>
            !c.isGroup &&
            c.participants.includes(idUser) &&
            c.participants.includes(selectedUserId)
        );

        if (!convo) {
          convo = {
            id: Date.now(),
            participants: [idUser, selectedUserId],
            messages: [],
            isArchived: false,
          };
          conversations.push(convo);
          localStorage.setItem("conversations", JSON.stringify(conversations));
        }

        setSelectedConversationId(convo.id);
      }

      if (!convo) return;

      const newMessageId = convo.messages.length
        ? Math.max(...convo.messages.map((m) => m.id)) + 1
        : 1;

      const newMessage = {
        id: newMessageId,
        senderId: idUser,
        content,
        timestamp: new Date().toISOString(),
      };

      convo.messages.push(newMessage);
      localStorage.setItem("conversations", JSON.stringify(conversations));

      input.value = "";

      loadDiscussionWith(selectedConversationId, idUser);
      renderContactsList(getDiscussionContacts(idUser), false, false);
    },
  },
  createElement("input", {
    class: [
      "w-full",
      "bg-[#eeeee8]",
      "border-none",
      "outline-none",
      "rounded-md",
      "p-3",
    ],
    type: "text",
    placeholder: "Tapez un message...",
  })
);

export const discussion = createElement(
  "div",
  {
    class: [
      "bg-[#f8f6f5]",
      "h-full",
      "flex-[5_1_0%]",
      "p-2",
      "flex",
      "flex-col",
      "justify-between",
      "items-center",
      "gap-1",
    ],
  },
  [
    createElement(
      "div",
      {
        class: ["w-full", "flex", "justify-between", "bg-[#eee7d6]", "p-2"],
      },
      [
        createElement(
          "div",
          {
            class: ["rounded-full", "bg-blue-500", "w-16", "h-16"],
          },
          ""
        ),
        createElement(
          "div",
          {
            class: ["flex", "justify-around", "gap-2"],
          },
          [deleteDiscussion, archive, blocConversation, deleteConversation]
        ),
      ]
    ),
    discussionChamp,
    createElement(
      "div",
      {
        class: [
          "w-full",
          "flex-[1_1_0%]",
          "bg-[#f8f6f5]",
          "flex",
          "justify-between",
          "items-center",
          "p-1",
          "gap-2",
        ],
      },
      [
        messageInput,
        createElement(
          "div",
          {
            class: [
              "flex",
              "justify-center",
              "items-center",
              "w-14",
              "h-14",
              "rounded-full",
              "bg-green-500",
            ],
          },
          createElement("i", {
            class: ["bi bi-arrow-right", "text-2xl", "text-white"],
          })
        ),
      ]
    ),
  ]
);


export function broadcastMessage(senderId, content) {
  if (!content.trim()) return;

  const timestamp = new Date().toISOString();

  users.forEach((user) => {
    if (user.id === senderId) return;

    let convo = conversations.find(
      (c) =>
        !c.isGroup &&
        c.participants.includes(senderId) &&
        c.participants.includes(user.id)
    );

    if (!convo) {
      convo = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        participants: [senderId, user.id],
        messages: [],
        isGroup: false,
        isArchived: false,
      };
      conversations.push(convo);
    }

    const newMessage = {
      id: convo.messages.length
        ? Math.max(...convo.messages.map((m) => m.id)) + 1
        : 1,
      senderId,
      content,
      timestamp,
    };

    convo.messages.push(newMessage);
  });

  localStorage.setItem("conversations", JSON.stringify(conversations));
  alert("Message diffusé à tous les utilisateurs !");
}
