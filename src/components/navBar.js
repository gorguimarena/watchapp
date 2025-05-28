import { optionHandlers } from './../DATA/Const.js'
import { infoOptions } from './../DATA/Const.js'
import { createElement } from './components.js'


const nav = createElement('div', {
    class: [
        'flex',
        'justify-between',
        'items-center',
        'gap-2',
        'flex-col',
        'w-full',
        'cursor-pointer'
    ],
    vFor: {
        each: infoOptions,
        render: (item) => {
            return createElement('div', {
            class: [
                'h-16',
                'w-full',
                'rounded-md',
                'border-2',
                'border-[#e3a77c]',
                'flex',
                'justify-center',
                'items-center',
                'text-white',
                'flex-col',
            ],
            onclick: () => optionHandlers[item.text]?.()
            }, [
            createElement('i', {
                class: [
                item.icon,
                'text-2xl',
                'text-black',
                'font-bold',
                ],
            }),
            createElement('span', {
                class: [
                'text-xs',
                'font-bold',
                'text-black',
                'text-center',
                ],
            }, item.text),
            ]);
        }
        }

})



export const sideBar = createElement('div', {
    class: [
        'bg-[#efefe8]',
        'w-24',
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'p-2',
    ],
}, nav);