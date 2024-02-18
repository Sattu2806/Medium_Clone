import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/prismadb"

export async function PATCH(request: NextRequest) {
    const {storyId} = await request.json()

    if(!storyId){
        throw new Error ('No storyId was found')
    }

    const story = await prisma.story.findUnique({
        where:{
            id:storyId
        }
    })
    
    if(!story){
        throw new Error('No Story were found')
    }

    try {
        const updatedStory = await prisma.story.update({
            where:{
                id:story.id
            },
            data:{
                publish:false,
            }
        })
        return NextResponse.json(updatedStory)
    } catch (error) {
        console.log(error)
        return NextResponse.error()
    }
}
