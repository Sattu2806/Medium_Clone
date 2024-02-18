"use server"
import prisma from "@/app/prismadb"
import { getCurrentUserId } from "./User"

export const CheckFollowing = async (authorId:string) => {
    const CurrentUserid = await getCurrentUserId()
    if (!CurrentUserid) return 
    try {
        const IsFollowed = await prisma.following.findFirst({
            where:{
                followingId:authorId,
                followerId:CurrentUserid
            }
        })

        return {ifFollowing: !!IsFollowed}
    } catch (error) {
        return {ifFollowing: false}
    }
}

export const NumberFollowers = async (authorId:string) => {
    try {
        const NoOfFollowing = await prisma.following.aggregate({
            where:{
                followingId:authorId
            },
            _count:true
        })

        return {followers: JSON.parse(JSON.stringify(NoOfFollowing._count))} 
    } catch (error) {
        return {followers: 0} 
    }
}