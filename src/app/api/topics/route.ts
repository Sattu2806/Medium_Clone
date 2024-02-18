import prisma from "@/app/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
      return NextResponse.json('User not present');
    }

    try {
        const {tag} = await request.json()
        
        const Topic = await prisma.topics.findFirst({
            where:{
                userId
            }
        })

        if (!Topic) {
            await prisma.topics.create({
                data: {
                    userId,
                    selectedTopics: tag
                }
            });
        } else {
            await prisma.topics.update({
                where: {
                    id: Topic.id
                },
                data: {
                    selectedTopics: tag
                }
            });
        }

        return NextResponse.json({ message: 'Added tags successfully' });
    } catch (error) {
        console.log('Error while adding topics/tags')
        return NextResponse.error()
    }
}