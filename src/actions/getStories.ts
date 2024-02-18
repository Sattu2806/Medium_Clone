"use server"
import prisma from "@/app/prismadb"
import { getCurrentUserId } from "./User"

export const getStoryById = async (storyId:string) => {
    if(!storyId){
        throw new Error('Do not have storyId')
    }

    try {
        const StoryById = await prisma.story.findUnique({
            where:{
                id:storyId,
                publish:false
            }
        })

        return {response : StoryById}
    } catch (error) {
        return {error: 'Error on getting the story by Id'}
    }
}

export const getPublishedStoryById = async (storyId:string) => {
    if(!storyId){
        throw new Error('Do not have storyId')
    }

    try {
        const StoryById = await prisma.story.findUnique({
            where:{
                id:storyId,
                publish:true
            }
        })

        return {response : StoryById}
    } catch (error) {
        return {error: 'Error on getting the story by Id'}
    }
}

export const getStoriesByAuthor = async (storyId:string, authorId:string) => {
    try {
        const AuthorStories = await prisma.story.findMany({
            where:{
                authorId,
                NOT:{
                    id:storyId
                },
                publish:true
            }
        })

        return {response: AuthorStories}
    } catch (error) {
        return {error: "Error on getting stories by author"}
    }
}

export const getUniqueTopics = async () =>{
    try {
        const AllStoryTopics = await prisma.story.findMany({
            select:{
                topics:true
            }
        })

        const uniqueTopics = Array.from(new Set(AllStoryTopics.flatMap((item)=> item.topics)))

        const formattedData = uniqueTopics.map(topic => ({
            value:topic,
            label:topic
        }))

        return {response : formattedData}
    } catch (error) {
        return {response: []}
    }
}

export const getStoryByTag = async (tag:string) => {
    try {
        if(tag === 'All'){
            const AllStories = await prisma.story.findMany({
                where:{
                    publish:true
                }
            })
            return {stories: AllStories}
        }
        const taggedStories = await prisma.story.findMany({
            where:{
                topics:{
                    has:tag
                },
                publish:true
            }
        })
        return {stories: taggedStories}
    } catch (error) {
        return {stories: []}
    }
}
