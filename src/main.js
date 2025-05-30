import "./index.css";
import { createElement } from "./components/components.js";
import { main } from "./components/main-disc.js";
import { sideBar } from "./components/navBar.js";
import { discussion } from "./components/discussion.js";
import { newContact, createGroupForm } from "./components/form.js";
import { connexionChamps } from "./components/form.js";
import { listMembers } from "./DATA/Const.js";

export const memberSpace = createElement(
  "div",
  {
    class: ["bg-red-500", "h-screen", "flex", "gap-0", "z-20"],
    vShow: false,
  },
  [newContact, sideBar, main, discussion, createGroupForm]
);

const app = createElement(
  "div",
  {
    class: ["bg-[#f8f6f5]", "h-screen", "relative", "z-10", "w-screen"],
  },
  [memberSpace, connexionChamps, listMembers]
);

document.body.appendChild(app);
