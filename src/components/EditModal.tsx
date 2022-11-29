import type { Dispatch, SetStateAction } from 'react';
import React from 'react'

interface EditModalProps {
    open: Dispatch<SetStateAction<boolean>>
}

export default function EditModal({ open }: EditModalProps) {
    return (
        <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <div className="space-y-4 p-3 bg-gray-700 rounded-lg text-white">
                <h3 className='text-xl font-medium'>Name of Item</h3>
                <div className='flex justify-end space-x-4'>
                    <button className='bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600'
                        onClick={() => open(false)}>Cancel</button>
                </div>
            </div>

        </div>
    )
}
