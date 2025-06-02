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
  getDiscussionContacts,
  users,
} from "../DATA/Const";
import {
  deleteConversation,
  deleteDiscussion,
  blocConversation,
} from "./actions";

export function setAvatarUser(avatar) {
  ElAvatar.textContent = avatar;
}
export function setNameUser(name) {
  ElName.textContent = name;
}
export function setLastMessageUser(message) {
  ElMessage.textContent = message;
}

const ElAvatar = createElement("div", {
  class: [
    "rounded-full",
    "bg-blue-500",
    "w-16",
    "h-16",
    "flex",
    "justify-center",
    "items-center",
  ],
});

const ElName = createElement("span", {
  class: ["text-lg", "font-semibold", "text-black"],
});
const ElMessage = createElement("span", {
  class: ["text-sm", "text-gray-600"],
});

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

/* export const messageInput = createElement(
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
); */

let isRecording = false;

export const messageInput = createElement(
  "form",
  {
    class: ["flex", "gap-2", "items-center", "px-2", "py-1", "bg-white", "w-full"],
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

      const newMessage = {
        id: Date.now(),
        senderId: idUser,
        content,
        timestamp: new Date().toISOString(),
        type: "text",
      };

      convo.messages.push(newMessage);
      localStorage.setItem("conversations", JSON.stringify(conversations));

      input.value = "";

      loadDiscussionWith(selectedConversationId, idUser);
      renderContactsList(getDiscussionContacts(idUser), false, false);
    },
  },
  [
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
    }),
    createElement(
      "button",
      {
        type: "button",
        class: [
          "bg-blue-400",
          "text-white",
          "p-3",
          "rounded-full",
          "ml-2",
          "hover:bg-blue-600",
        ],
        onclick: () => {
          if (!isRecording) {
            startRecording();
          } else {
            stopRecording();
          }
        },
      },
      "🎤"
    ),
    createElement(
      "button",
      {
        type: "button",
        class: [
          "flex",
          "justify-center",
          "items-center",
          "p-3",
          "rounded-full",
          "bg-green-400",
          "hover:bg-green-500"
        ],
      },
      createElement("i", {
        class: ["bi bi-arrow-right", "text-white"],
      })
    ),
  ]
);

let mediaRecorder;
let audioChunks = [];

/**
 * Lance l'enregistrement audio via le micro de l'utilisateur.
 */
function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      isRecording = true;
      audioChunks = [];

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", handleAudioStop);
    })
    .catch((err) => {
      console.error("Erreur d'accès au micro :", err);
      alert("Impossible d'accéder au micro.");
    });
}

/**
 * Arrête l'enregistrement si actif.
 */
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

/**
 * Gère la conversion et l'enregistrement du message audio une fois l'enregistrement terminé.
 */
function handleAudioStop() {
  isRecording = false;

  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
  const reader = new FileReader();

  reader.onloadend = () => {
    const base64Audio = reader.result; // Format: data:audio/webm;base64,...

    // On récupère la conversation sélectionnée
    const convo = conversations.find(c => c.id === selectedConversationId);
    if (!convo) return;

    // Nouveau message audio
    const newMessage = {
      id: Date.now(),
      senderId: idUser,
      content: base64Audio,
      timestamp: new Date().toISOString(),
      type: "audio",
    };

    // On ajoute le message à la conversation et on sauvegarde
    convo.messages.push(newMessage);
    localStorage.setItem("conversations", JSON.stringify(conversations));

    // Rafraîchissement de l'affichage
    loadDiscussionWith(selectedConversationId, idUser);
    renderContactsList(getDiscussionContacts(idUser), false, false);
  };

  reader.readAsDataURL(audioBlob); // Conversion en base64
}


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
            class: ["flex", "justify-center", "items-center"],
          },
          [
            ElAvatar,
            createElement(
              "div",
              {
                class: ["flex", "flex-col", "gap-1", "ml-2"],
              },
              [ElName, ElMessage]
            ),
          ]
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
          "p-1",
          "gap-2",
        ],
      },
      [messageInput]
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
  renderContactsList(getDiscussionContacts(idUser), false, false);
}
