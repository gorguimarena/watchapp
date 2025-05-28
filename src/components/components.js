export function createElement(tag, props = {}, content = "") {
    if (typeof tag !== "string") return null;
    // Gestion de v-if
    if ('vIf' in props && !props.vIf) return null;
    const fragment = document.createDocumentFragment();


    // Gestion de v-for (retourne un fragment)
    if ('vFor' in props) {
        const { render } = props.vFor;
        let { each } = props.vFor;
        
        
        if (Number.isInteger(each)) {
            const result = new Array(each).fill('');
            each = result;
        }
        each.forEach((item) => {
            const child = render(item );
            if (child instanceof Node) {
                fragment.appendChild(child);
            }
        });
    }
    

    const el = document.createElement(tag);

    for (const key in props) {
        const value = props[key];

        // Classes
        if (key === "class" || key === "className") {
            el.className = Array.isArray(value) ? value.join(" ") : value;
        }

        // Événements
        else if (key.startsWith("on") && typeof value === "function") {
            const eventName = key.slice(2).toLowerCase();
            el.addEventListener(eventName, value);
        }

        // v-show => toggle `display: none`
        else if (key === "vShow") {
            el.style.display = value ? "" : "none";
        }

        // vIf et vFor 
        else if (key === "vIf" || key === "vFor") {
            continue;
        }

        // :attr => dynamic binding
        else if (key.startsWith(":")) {
            const realAttr = key.slice(1);
            el.setAttribute(realAttr, value);
        }

        // style objet
        else if (key === "style" && typeof value === "object") {
            Object.assign(el.style, value);
        }

        // Attribut HTML classique
        else {
            el.setAttribute(key, value);
        }
    }

    // Contenu : string | Node | array
    if (Array.isArray(content)) {
        content.forEach(item => {
            if (typeof item === "string") {
                el.appendChild(document.createTextNode(item));
            } else if (item instanceof Node) {
                el.appendChild(item);
            }
        });
    } else if (typeof content === "string") {
        el.textContent = content;
    } else if (content instanceof Node) {
        el.appendChild(content);
    }

    // Méthodes pour chaînage
    el.addElement = function (tag, props = {}, content = "") {
        const newEl = createElement(tag, props, content);
        this.appendChild(newEl);
        return this;
    };
    el.addNode = function (node) {
        this.appendChild(node);
        return this;
    };
    fragment && el.appendChild(fragment);

    
    
    return el;
}