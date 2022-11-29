import React from 'react'
import type { GetStaticPropsContext, GetStaticPaths } from 'next';
import type { InferGetStaticPropsType } from 'next';
import { prisma } from '../../server/trpc/context';
import { appRouter } from '../../server/trpc/router/_app';
import superjson from 'superjson';
import { trpc } from '../../utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import Link from 'next/link';


export async function getStaticProps(
    context: GetStaticPropsContext<{ noteId: string }>,
) {
    const ssg = await createProxySSGHelpers({
        router: appRouter,
        ctx: { prisma },
        transformer: superjson, // optional - adds superjson serialization
    });
    const id = context.params?.noteId as string;
    await ssg.shoppingList.getSpecificItem.prefetch({ text: id });
    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
        revalidate: 1,
    };
}


export const getStaticPaths: GetStaticPaths = async () => {
    const items = await prisma.shoppingItem.findMany({
        select: {
            id: true,
        },
    });
    return {
        paths: items.map((item) => ({
            params: {
                noteId: item.id,
            },
        })),
        // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
        fallback: 'blocking',
    };
};

export default function Note(props: InferGetStaticPropsType<typeof getStaticProps>) {

    const { id } = props
    const postQuery = trpc.shoppingList.getSpecificItem.useQuery({ text: id });
    if (postQuery.status !== 'success' && !postQuery.data) {
        // won't happen since we're using `fallback: "blocking"`
        return <>Loading...</>;
    }
    const { data } = postQuery;
    if (!data) return <p>Loading...</p>
    return (
        <div className='flex w-auto m-2 p-2'>
            <div className='card p-2 text-xl flex flex-col space-y-2 items-start justify-center'>
                <p>Note: {data.name}</p>
                <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(data.updatedAt).toLocaleString()}</p>
                {data.checked ? (
                    <input type="checkbox" checked={true} />
                ) : null}
                <Link href={'/'}>
                    <button className='p-2 my-2 bg-gray-600 text-white rounded-lg'>Back</button>
                </Link>
            </div>
        </div>
    )
}
