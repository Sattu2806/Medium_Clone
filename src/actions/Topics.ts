"use server"
import prisma from "@/app/prismadb"
import { getCurrentUserId } from "./User"

export const GetSelectedTopics = async () => {
    const UserId = await getCurrentUserId()
    if(!UserId) throw new Error('User not logged in')

    try {
        const tags = await prisma.topics.findFirst({
            where:{
                userId:UserId
            },
            select:{
                selectedTopics:true
            }
        })
        
        const formattedData = tags?.selectedTopics.map(topic => ({
            value:topic,
            label:topic
        }))
        return {Tags: formattedData || []}
    } catch (error) {
        return {Tags: []}
    }
}