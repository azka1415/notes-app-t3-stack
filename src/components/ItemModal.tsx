import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import React from 'react'
import { trpc } from '../utils/trpc';
import type { ShoppingItem } from '@prisma/client';

interface ItemModalProps {
    open: Dispatch<SetStateAction<boolean>>
    setItems: Dispatch<SetStateAction<ShoppingItem[]>>
}

const ItemModal: FC<ItemModalProps> = ({ open, setItems }) => {
    const [input, setInput] = useState('')
    const item = trpc.shoppingList.addItem.useMutation()

    const handleAdd = () => {
        item.mutate({ text: input }, {
            onSuccess(data) {
                setItems(prev => [...prev, data])
            },
        })
        open(false)
    }



    return (
        <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <div className="space-y-4 p-3 bg-gray-700 rounded-lg text-white">
                <h3 className='text-xl font-medium'>Name of Item</h3>
                <input type="text" className='rounded-lg p-2 text-black' value={input} onChange={e => setInput(e.target.value)} />
                <div className='flex justify-end space-x-4'>
                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600' onClick={() => open(false)}>Cancel</button>
                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'
                        onClick={handleAdd}>Add</button>
                </div>
            </div>

        </div>
    )
}

export default ItemModal