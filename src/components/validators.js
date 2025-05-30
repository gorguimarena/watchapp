import { users, conversations, setUserId, groups } from "../DATA/Const";
import { contactEr } from "./Errors";
import { memberSpace } from "../main";
import { connexionChamps } from "./form";

export function doesContactExist(contact) {
  return users.some((user) => user.contact === contact);
}

export function doesGroupNameExist(name) {
  return groups.some((grp) => grp.name === name);
}

export function generateUniqueName(baseName, existsFn) {
  let suffix = 1;
  let newName = baseName;
  while (existsFn(newName)) {
    newName = `${baseName}-${suffix}`;
    suffix++;
  }
  return newName;
}

export function verifierContact(contact) {
  const user = users.find((user) => user.contact === contact);
  if (user) {
    connecterUtilisateur(user.id);
  } else {
    contactEr.textContent = "Un compte avec ce numéro n'existe pas.";
    contactEr.style.display = "block";
    return;
  }
}

function connecterUtilisateur(id) {
  setUserId(id);
  showMemberSpace();
}

function showMemberSpace() {
  memberSpace.style.display = 'flex';
  connexionChamps.style.display = 'none';
}
