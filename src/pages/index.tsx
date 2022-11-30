import type { ShoppingItem } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import ItemModal from "../components/ItemModal";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [open, setopen] = useState(false)
  const [checkItems, setCheckItems] = useState<ShoppingItem[]>([])
  const itemDelete = trpc.shoppingList.deleteItem.useMutation()
  const updateCheck = trpc.shoppingList.checkItem.useMutation()

  const result = trpc.shoppingList.getItems.useQuery()
  useEffect(() => {
    if (result.data) {
      setItems(result.data)
      result.refetch()
      return () => setItems([])
    }
    return () => setItems([])
  }, [result.data, result])

  const handleDelete = (id: string) => {
    itemDelete.mutate({ text: id }, {
      onSuccess(data) {
        setItems((prev) => prev.filter((item) => item.id !== data.id))
      },
    })
  }

  const handleChecked = (id: string, check: boolean) => {
    updateCheck.mutate({ text: id, check }, {
      onSuccess(data) {
        if (checkItems.some((item) => item.id === data.id)) {
          setCheckItems((prev) => prev.filter((item) => item.id !== data.id))
        }
        else {
          setCheckItems((prev) => [...prev, data])
        }
      },
    })
  }
  if (!result.data || result.isLoading) return <p>Loading...</p>


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col my-10  mx-2">

        {open && <ItemModal open={setopen} setItems={setItems} />}

        <main className="flex flex-col container w-full">
          <div className="flex space-x-4">
            <h2 className="text-2xl font-semibold">Notes App</h2>
            <button className="bg-violet-500 text-sm p-2 rounded-md text-white transition hover:bg-violet-600"
              onClick={() => setopen(true)}>Add Note</button>
          </div>
        </main>

        <div className="space-y-6 my-2 w-full lg:grid lg:grid-cols-4 lg:space-y-0 lg:gap-4">
          {items.sort((a, b) => {
            const one = new Date(b.updatedAt).getTime()
            const two = new Date(a.updatedAt).getTime()
            return one - two
          }).map(item => (
            <div key={item.id} className='flex lg:flex lg:flex-col space-x-4 justify-between items-center text-center border p-1 border-black rounded-lg'>
              <div className="flex flex-row lg:flex lg:flex-col space-x-2 justify-start items-center lg:space-x-0 lg:space-y-1">

                <Link href={`/notes/${item.id}`}>
                  <p className="cursor-pointer text-xl transition hover:underline">{item.name}</p>
                </Link>
                {item.checked === true ? (
                  <input type="checkbox" checked={true} className='p-1 rounded-lg bg-green-600' />
                ) : null}
              </div>
              <p className="hidden tansition-all md:flex">Created: {new Date(item.createdAt).toLocaleString()}</p>
              {new Date(item.updatedAt).toLocaleString() === new Date(item.createdAt).toLocaleString() ? null :
                (<p className="hidden tansition-all md:flex">Updated: {new Date(item.updatedAt).toLocaleString()}</p>)
              }
              <div className="flex space-x-2 justify-end items-center">

                {item.checked === false ?
                  (<button onClick={() => handleChecked(item.id, true)} className='bg-green-600 text-white rounded-lg p-2 transition-all hover:bg-green-700'>Check</button>) :
                  (<button onClick={() => handleChecked(item.id, false)} className='bg-green-600 text-white rounded-lg p-2 transition-all hover:bg-green-700'>Uncheck</button>)}
                <button
                  onClick={() => handleDelete(item.id)} className='bg-red-600 p-2 rounded-lg text-white transition-all hover:bg-red-700'>Delete</button>
              </div>
            </div>

          ))}
        </div>

      </div >
    </>
  );
};

export default Home;
