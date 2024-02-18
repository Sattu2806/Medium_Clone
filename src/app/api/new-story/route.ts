import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/app/prismadb"

export async function POST(request: NextRequest){
    const {userId} : {userId: string | null} = auth()

    if(!userId){
        throw new Error('No user is signed in')
    }

    try {
        const NewStory = await prisma.story.create({
            data:{
                authorId:userId
            }
        })

        return NextResponse.json(NewStory)
    } catch (error) {
        return NextResponse.error()
    }
}

export async function PATCH(request: NextRequest){
    const body = await request.json()
    const {userId} : {userId: string | null} = auth()

    if(!userId){
        throw new Error('No user is signed in')
    }

    const {storyId, content} = body

    if(!storyId || !content){
        throw new Error('Missing fields')
    }

    console.log(storyId)

    const Story = await prisma.story.findUnique({
        where:{
            id:storyId
        }
    })

    if(!Story){
        throw new Error('No story were found')
    }

    try {
        await prisma.story.update({
            where:{
                id:Story.id,
            },
            data:{
                content
            }
        })

        return NextResponse.json('Successfully saved the story')
    } catch (error) {
        return NextResponse.error()
    }
}