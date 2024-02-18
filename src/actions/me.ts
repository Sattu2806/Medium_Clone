"use server"
import prisma from "@/app/prismadb"
import { getCurrentUserId } from "./User"

export const getDraftStory = async () => {
    const userId = await getCurrentUserId()
    if(!userId) return {response: []}
    try {
        const stories = await prisma.story.findMany({
            where:{
                publish:false,
                authorId:userId
            }
        })

        return {response: stories}
    } catch (error) {
        return {response: []}
    }
}

export const getPublishedStory = async () => {
    const userId = await getCurrentUserId()
    if(!userId) return {response: []}
    try {
        const stories = await prisma.story.findMany({
            where:{
                publish:true,
                authorId:userId
            }
        })

        return {response: stories}
    } catch (error) {
        return {response: []}
    }
}

export const getSavedStory = async () => {
    const userId = await getCurrentUserId()
    if(!userId) return {response: []}
    try {
        const stories = await prisma.story.findMany({
            where:{
                publish:true,
                Save:{
                    some:{
                        userId
                    }
                }
            }
        })

        return {response: stories}
    } catch (error) {
        return {response: []}
    }
}
