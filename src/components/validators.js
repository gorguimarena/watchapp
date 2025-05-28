import { users, conversations } from "../DATA/Const";

export function doesContactExist(contact) {
  return users.some(user => user.contact === contact);
}

export function doesGroupNameExist(name) {
  return conversations.some(conv => conv.isGroup && conv.name === name);
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