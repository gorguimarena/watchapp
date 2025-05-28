import { createElement } from "./components";
import { users, conversations } from "../DATA/Const";
import { nameError, contactError, groupNameError, memberError } from "./Errors";
import { doesContactExist, doesGroupNameExist, generateUniqueName } from "./validators";

const inputName = createElement('input', {
    type: 'text',
    name: 'name',
    placeholder: 'Nom',
    class: [
      'border',
      'rounded',
      'p-2',
      'w-96',
      'opacity-100',
      'z-60',
      'outline-none'
    ]
  })
const inputContact = createElement('input', {
    type: 'text',
    name: 'contact',
    placeholder: 'Numéro de téléphone',
    class: [
      'border',
      'rounded',
      'p-2',
      'w-96',
      'opacity-100',
      'outline-none'
    ]
  });

export const groupMembersListContainer = createElement('div', {
  class: [
    'w-80',
    'max-h-60',
    'overflow-y-auto',
    'bg-white',
    'rounded',
    'p-2',
    'flex',
    'flex-col',
    'gap-2',
  ]
});

export const newContact = createElement('form', {
  class: [
    'p-12', 'absolute', 'top-0', 'left-0', 'h-screen', 'w-full',
    'bg-black', 'z-50', 'flex', 'flex-col', 'gap-2', 'items-center',
    'justify-center', 'opacity-80'
  ],
  vShow: false,
  onsubmit: (e) => {
    e.preventDefault();
    const nameInput = e.target.name;
    const contactInput = e.target.contact;
    let name = nameInput.value.trim();
    const contact = contactInput.value.trim();

    nameError.textContent = name ? '' : 'Le nom est requis.';
    contactError.textContent = contact ? '' : 'Le contact est requis.';
    const regex = /^\d+$/;
    
    if (!regex.test(contact)) {
      contactError.textContent = 'Le numéro de téléphone n\'est pas valide.';
      return;
    }

    if (!name || !contact) return;

    if (doesContactExist(contact)) {
      contactError.textContent = 'Ce numéro est déjà utilisé.';
      return;
    }

    name = generateUniqueName(name, nom => users.some(u => u.name === nom));

    const newId = users.length + 1;
    users.push({ id: newId, name, contact });
    localStorage.setItem('users', JSON.stringify(users));

    newContact.style.display = "none";
    e.target.reset();
    nameError.textContent = '';
    contactError.textContent = '';
  }
}, [
  createElement('input', {
    type: 'text',
    name: 'name',
    placeholder: 'Nom du contact',
    class: ['border', 'rounded', 'p-2', 'w-96', 'outline-none']
  }),
  nameError,

  createElement('input', {
    type: 'text',
    name: 'contact',
    placeholder: 'Numéro de téléphone',
    class: ['border', 'rounded', 'p-2', 'w-96', 'outline-none']
  }),
  contactError,

  createElement('div', {
    class: ['flex', 'gap-2', 'w-96']
  }, [
    createElement('button', {
      type: 'submit',
      class: [
        'bg-blue-500', 'text-white', 'p-2', 'rounded', 'font-bold',
        'hover:bg-blue-600', 'flex-1'
      ]
    }, "Ajouter le contact"),

    createElement('button', {
      type: 'button',
      class: [
        'bg-red-500', 'text-white', 'p-2', 'rounded', 'font-bold',
        'hover:bg-red-600', 'flex-1'
      ],
      onclick: () => {
        newContact.style.display = "none";
        nameError.textContent = '';
        contactError.textContent = '';
      }
    }, "Annuler")
  ])
]);

export const createGroupForm = createElement('form', {
  id: 'create-group-form',
  class: [
    'p-6', 'absolute', 'top-0', 'left-0', 'h-screen', 'w-full', 'bg-black',
    'z-50', 'flex', 'flex-col', 'gap-4', 'items-center', 'justify-center', 'opacity-90'
  ],
  vShow: false,
  onsubmit: (e) => {
    e.preventDefault();

    const groupNameInput = e.target.groupName;
    let groupName = groupNameInput.value.trim();
    const memberIds = Array.from(e.target.members)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => parseInt(checkbox.value));

    groupNameError.textContent = groupName ? '' : 'Le nom du groupe est requis.';
    memberError.textContent = memberIds.length ? '' : 'Veuillez sélectionner au moins un membre.';

    if (!groupName || memberIds.length === 0) return;

    groupName = generateUniqueName(groupName, doesGroupNameExist);

    const currentUserId = 1;
    const fullMemberList = [...new Set([currentUserId, ...memberIds])];

    const newGroup = {
      id: Date.now(),
      name: groupName,
      isGroup: true,
      participants: fullMemberList,
      messages: []
    };

    conversations.push(newGroup);
    localStorage.setItem('conversations', JSON.stringify(conversations));

    createGroupForm.style.display = 'none';
    e.target.reset();
    groupNameError.textContent = '';
    memberError.textContent = '';
  }
}, [
  createElement('input', {
    type: 'text',
    name: 'groupName',
    placeholder: 'Nom du groupe',
    class: ['border', 'rounded', 'p-2', 'w-96', 'outline-none']
  }),
  groupNameError,
  groupMembersListContainer,
  memberError,

  createElement('div', {
    class: ['flex', 'gap-4', 'w-96', 'justify-between']
  }, [
    createElement('button', {
      type: 'submit',
      class: [
        'bg-blue-600', 'text-white', 'p-2', 'rounded', 'font-bold', 'flex-1'
      ]
    }, 'Créer le groupe'),

    createElement('button', {
      type: 'button',
      class: [
        'bg-red-500', 'text-white', 'p-2', 'rounded', 'font-bold', 'flex-1'
      ],
      onclick: () => {
        createGroupForm.style.display = 'none';
        groupNameError.textContent = '';
        memberError.textContent = '';
      }
    }, 'Annuler')
  ])
]);

export function populateGroupMembers() {
  groupMembersListContainer.innerHTML = ''; 

  users.forEach(user => {
    const label = createElement('label', {
      class: ['flex', 'items-center', 'gap-2']
    }, [
      createElement('input', {
        type: 'checkbox',
        name: 'members',
        value: user.id,
        class: ['form-checkbox']
      }),
      createElement('span', {}, user.name)
    ]);

    groupMembersListContainer.appendChild(label);
  });
}

export function showAddMembersForm(conversationId) {
  const conv = conversations.find(c => c.id === conversationId && c.isGroup);
  if (!conv) return alert("Conversation non trouvée ou ce n'est pas un groupe.");

  const formWrapper = document.createElement('div');
  formWrapper.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50';
  
  const form = document.createElement('form');
  form.className = 'bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-auto flex flex-col gap-4';

  const title = document.createElement('h2');
  title.className = 'text-xl font-bold text-center';
  title.textContent = 'Ajouter des membres au groupe';

  const contactList = document.createElement('div');
  contactList.className = 'flex flex-col gap-2';

  const alreadyInGroup = new Set(conv.participants);

  users.forEach(user => {
    if (!alreadyInGroup.has(user.id)) {
      const label = document.createElement('label');
      label.className = 'flex items-center gap-2';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = user.id;

      const span = document.createElement('span');
      span.textContent = `${user.name} (${user.contact})`;

      label.appendChild(checkbox);
      label.appendChild(span);
      contactList.appendChild(label);
    }
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold';
  submitBtn.textContent = 'Ajouter';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'bg-red-500 text-white p-2 rounded hover:bg-red-600 font-bold';
  cancelBtn.textContent = 'Annuler';
  cancelBtn.onclick = () => document.body.removeChild(formWrapper);

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'flex gap-2';
  buttonGroup.appendChild(submitBtn);
  buttonGroup.appendChild(cancelBtn);

  form.appendChild(title);
  form.appendChild(contactList);
  form.appendChild(buttonGroup);
  formWrapper.appendChild(form);
  document.body.appendChild(formWrapper);

  form.onsubmit = (e) => {
    e.preventDefault();
    const selected = Array.from(contactList.querySelectorAll('input:checked')).map(cb => parseInt(cb.value));
    if (!selected.length) {
      alert('Sélectionnez au moins un contact.');
      return;
    }

    conv.participants.push(...selected);
    localStorage.setItem('conversations', JSON.stringify(conversations));
    alert(`${selected.length} membre(s) ajouté(s) au groupe.`);
    document.body.removeChild(formWrapper);
  };
}