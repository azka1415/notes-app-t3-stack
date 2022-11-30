import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import React from 'react'
import { trpc } from '../utils/trpc';
import { NextResponse } from 'next/server';
import { useRouter } from 'next/router';

interface EditModalProps {
    open: Dispatch<SetStateAction<boolean>>
    noteId: string
}



export default function EditModal({ open, noteId }: EditModalProps) {
    const router = useRouter()
    const [newName, setNewName] = useState('')
    const item = trpc.shoppingList.editItem.useMutation()
    const handleEdit = () => {
        item.mutate({ text: noteId, newName })
        open(false)
        router.reload()
    }

    return (
        <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <div className="space-y-4 p-3 bg-gray-700 rounded-lg text-white">
                <h3 className='text-xl font-medium'>Edit Item</h3>
                <div className='flex items-center space-x-4'>
                    <label htmlFor="item_name">Note Name</label>
                    <input type="text" className='rounded-lg p-2 text-black' name='item_name' id='item_name'
                        onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className='flex items-center justify-between'>

                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'
                        onClick={() => open(false)}>Cancel</button>
                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'
                        onClick={handleEdit}>Add</button>
                </div>
            </div>

        </div>
    )
}
