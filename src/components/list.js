import { users, conversations, idUser } from "../DATA/Const";
import { renderContactsList } from "../DATA/Const";

function searchUserFromLocal(query) {
  const lower = query.toLowerCase();
  return users.filter(
    (u) => u.name.toLowerCase().includes(lower) || u.contact.includes(query)
  );
}

export function showSearchFromUsers(query) {
  let results;

  if (query.length === 1 && query === "#") {
    results = users
      .filter((user) => user.id !== idUser)
      .map((user) => {
        const conv = conversations.find(
          (c) =>
            !c.isGroup &&
            c.participants.includes(idUser) &&
            c.participants.includes(user.id)
        );

        const lastMsg = conv?.messages.at(-1);

        return {
          id: user.id,
          name: user.name,
          contact: user.contact,
          conversationId: conv ? conv.id : null,
          lastMessage: lastMsg ? lastMsg.content : "",
          date: lastMsg ? lastMsg.timestamp?.slice(11, 16) : "",
        };
      });
  } else {
    const foundUsers = searchUserFromLocal(query);

    results = foundUsers.map((user) => {
      let conv = conversations.find(
        (c) =>
          !c.isGroup &&
          c.participants.includes(idUser) &&
          c.participants.includes(user.id)
      );

      if (!conv) {
        conv = {
          id: Date.now(),
          participants: [idUser, user.id],
          messages: [],
          isArchived: false,
        };
        conversations.push(conv);
        localStorage.setItem("conversations", JSON.stringify(conversations));
      }

      const lastMsg = conv.messages.at(-1);

      return {
        id: user.id,
        name: user.name,
        contact: user.contact,
        conversationId: conv.id,
        lastMessage: lastMsg ? lastMsg.content : "",
        date: lastMsg ? lastMsg.timestamp?.slice(11, 16) : "",
      };
    });
  }

  renderContactsList(results, false, null, false);
}
