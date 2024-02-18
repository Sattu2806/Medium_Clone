"use server"
import prisma from "@/app/prismadb"

export const getAllComments = async (storyId:string, parentCommentId?:string) => {
    if(!storyId){
        throw new Error('required data is not provided')
    }

    try {
        if(!parentCommentId){
            const Comments = await prisma.comment.findMany({
                where:{
                    storyId,
                    parentCommentId:null
                }, 
                include:{
                    Clap:true,
                    replies:true
                }
            })

            return {response: Comments}
        }
        const Comments = await prisma.comment.findMany({
            where:{
                storyId,
                parentCommentId
            }, 
            include:{
                Clap:true,
                replies:true
            }
        })

        return {response: Comments}
    } catch (error) {
        console.log("Error getting the story comments")
        return {error: "Error getting the story comments"}
    }
}

export const NumberOfComments = async (storyId:string) => {
    try {
        const commentsNo = await prisma.comment.aggregate({
            where:{
                storyId
            },
            _count:true
        })

        return  {reponse: commentsNo._count || 0}
    } catch (error) {
        return {error: "Error getting number oof comments"}
    }
}