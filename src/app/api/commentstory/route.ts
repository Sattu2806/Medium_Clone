import prisma from "@/app/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest){
    const {userId} = auth()
    if(!userId) throw new Error ('No user found')

    try {
        const body = await request.json()
        const {storyId, Content} = body

        if(!storyId || !Content){
            throw new Error('Insuficient data')
        }

        const existingStory = await prisma.story.findUnique({
            where:{
                id:storyId
            }
        })

        if(!existingStory){
            throw new Error('No stories were found to comment')
        }

        const newComment = await prisma.comment.create({
            data:{
                userId,
                storyId,
                content:Content
            }
        })

        return NextResponse.json('Successfully commented on story')
    } catch (error) {
        console.log("Error in commenting", error)
        return NextResponse.error()
    }
}