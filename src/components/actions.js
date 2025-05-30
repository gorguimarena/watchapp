import { createElement } from "./components.js";
import {
  conversations,
  selectedConversationId,
  renderContactsList,
  getDiscussionContacts,
  idUser,
} from "../DATA/Const";

export const deleteDiscussion = createElement(
  "div",
  {
    class: [
      "rounded-full",
      "w-12",
      "h-12",
      "border-2",
      "flex",
      "justify-center",
      "items-center",
      "cursor-pointer",
      "bi bi-plus-lg",
      "border-[#272117]",
    ],
  },
  createElement("i", {
    class: ["text-2xl", "font-bold", "fa-solid fa-trash", "text-[#272117]"],
  })
);
export const deleteConversation = createElement(
  "div",
  {
    class: [
      "rounded-full",
      "w-12",
      "h-12",
      "border-2",
      "flex",
      "justify-center",
      "items-center",
      "cursor-pointer",
      "bi bi-trash",
      "border-[#a1040d]",
    ],
  },
  createElement("i", {
    class: ["text-2xl", "font-bold", "fa-solid fa-trash", "text-red-500"],
  })
);
export const blocConversation = createElement(
  "div",
  {
    class: [
      "rounded-full",
      "w-12",
      "h-12",
      "border-2",
      "flex",
      "justify-center",
      "items-center",
      "cursor-pointer",
      "border-[#272117]",
    ],
  },
  createElement("i", {
    class: ["text-2xl", "font-bold", "bi bi-square-fill", "text-[#272117]"],
  })
);
export const archive = createElement(
  "div",
  {
    class: [
      "rounded-full",
      "w-12",
      "h-12",
      "border-2",
      "flex",
      "justify-center",
      "items-center",
      "cursor-pointer",
      "hover:bg-gray-200",
      "bi bi-archive-fill",
      "border-[#837d73]",
    ],
    onclick: () => {
      if (selectedConversationId != null) {
        const conv = conversations.find((c) => c.id === selectedConversationId);

        if (conv) {
          conv.isArchived = true;
          localStorage.setItem("conversations", JSON.stringify(conversations));
          renderContactsList(getDiscussionContacts(idUser), false, false);
        }
      } else {
        alert("Veillez sélectionner une conversation pour l'archiver.");
      }
    },
  },
  createElement("i", {
    class: ["text-2xl", "font-bold", "text-gray-500", "text-[#837d73]"],
  })
);
