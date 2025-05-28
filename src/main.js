import './index.css';
import { createElement } from './components/components.js';
import { main } from './components/main-disc.js';
import { sideBar } from './components/navBar.js';
import { discussion } from './components/discussion.js';
import { newContact, createGroupForm } from './components/form.js';

const app = createElement('div', {
    class: [
        'bg-red-500',
        'h-screen',
        'flex', 
        'gap-0',
        'relative',
        'z-20'
    ],
},
[
    newContact,
    sideBar,
    main,
    discussion,
    createGroupForm
]);

document.body.appendChild(app);

