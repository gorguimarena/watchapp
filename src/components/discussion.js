import { createElement } from "./components";
import { infoActions } from "../DATA/Const"; 
import { archive } from "./actions";

import { deleteConversation, deleteDiscussion, blocConversation } from "./actions";

export const discussionChamp =  createElement('div', {
  id: 'discussion-champ',
  class: [
    'w-full',
    'overflow-y-auto',
    'p-2',
    'flex',
    'flex-col',
    'gap-2',
    'flex-[8_1%]',
    'bg-[#eee7d6]',
  ]
});


const messageInput = createElement(
            'form', {
                class: [
                    'flex-[14_1_0%]',
                ],
            },
            createElement(
                'input',
                {
                    class: [
                        'w-full',
                        'bg-[#eeeee8]',
                        'border-none',
                        'outline-none',
                        'rounded-md',
                        'p-3',
                    ],
                    type: 'text',
                }
            )
        )


export const discussion = createElement('div', {
    class: [
        'bg-[#f8f6f5]',
        'h-full',
        'flex-[5_1_0%]',
        'p-2',
        'flex',
        'flex-col',
        'justify-between',
        'items-center',
        'gap-1',
    ],
},
[
    createElement('div', {
        class: [
            'w-full',
            'flex',
            'justify-between',
            'bg-[#eee7d6]',
            'p-2',
        ],
    },
    [
        createElement('div', {
            class: [
                'rounded-full',
                'bg-blue-500',
                'w-16',
                'h-16',
            ],
        },
            ''
        ),
        createElement('div', 
        {
            class: [
                'flex',
                'justify-around',
                'gap-2',
            ],
            /* 'vFor': {
                each: infoActions,
                render: (item) => {
                    const icon = item.icon;
                    const textColor = item.color_text;
                    const bdColor = item.color_bd;
                    return createElement('div', {
                            class: [
                                'rounded-full',
                                'w-12',
                                'h-12',
                                'border-2',
                                'flex',
                                'justify-center',
                                'items-center',
                                'cursor-pointer',
                                bdColor
                            ],
                        },
                        createElement('i', {
                            class: [
                                'text-2xl',
                                'font-bold',
                                item.icon,
                                textColor
                            ],
                        })
                    )
                }
            } */
        },
        [
            blocConversation,
            deleteConversation,
            deleteDiscussion,
            archive
        ]
    
        )
    ]
    ),
    discussionChamp
   ,
    createElement('div', {
        class: [
            'w-full',
            'flex-[1_1_0%]',
            'bg-[#f8f6f5]',
            'flex',
            'justify-between',
            'items-center',
            'p-1',
            'gap-2',
        ],
    },
    [
        messageInput
        ,
        createElement(
            'div', {
                class: [
                    'flex',
                    'justify-center',
                    'items-center',
                    'w-14',
                    'h-14',
                    'rounded-full',
                    'bg-green-500',
                ],
            },
            createElement(
                'i',
                {
                    class: [
                        'bi bi-arrow-right',
                        'text-2xl',
                        'text-white',
                    ]
                }
            )
        )
    ]
)

]

);