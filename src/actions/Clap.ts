"use server"
import prisma from "@/app/prismadb"
import { getCurrentUserId } from "./User"

export const ClapCount = async (storyId:string, commentId?:string) => {
    try {
        if(!commentId){
            const Clap = await prisma.clap.aggregate({
                where:{
                    storyId,
                    commentId:null
                },
                _sum:{
                    clapCount:true
                }
            })
            
            return  Clap._sum?.clapCount || 0;
        }

        const Clap = await prisma.clap.aggregate({
            where:{
                storyId,
                commentId
            },
            _sum:{
                clapCount:true
            }
        })

        return  Clap._sum?.clapCount || 0;
    } catch (error) {
        return 0
    }
}

export const ClapCountByUser = async (storyId:string, commentId?:string) => {
    const userId = await getCurrentUserId()
    if(!userId) throw new Error("No logged user")

    try {
        if(!commentId){
            const Clap = await prisma.clap.aggregate({
                where:{
                    storyId,
                    userId,
                    commentId:null
                },
                _sum:{
                    clapCount:true
                }
            })
            
            return  JSON.parse(JSON.stringify(Clap._sum?.clapCount || 0)) ;
        }

        const Clap = await prisma.clap.aggregate({
            where:{
                storyId,
                userId,
                commentId
            },
            _sum:{
                clapCount:true
            }
        })

        return  JSON.parse(JSON.stringify(Clap._sum?.clapCount || 0)) ;
    } catch (error) {
        return 0
    }
}