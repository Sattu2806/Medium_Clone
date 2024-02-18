import prisma from "@/app/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return NextResponse.json('User not present');
  }

  try {
    const { AuthorId } = await request.json();


    const FollowingCheck = await prisma.following.findFirst({
      where: {
        followingId:AuthorId,
        followerId:userId,
      },
    });

    if (FollowingCheck) {
      await prisma.following.delete({
        where: {
          id: FollowingCheck.id
        },
      });

      return NextResponse.json({ message: 'Unfollowed the Author Succesfully' });
    } else {
      // If not saved, save the story
      const FollowingAuthor = await prisma.following.create({
        data: {
            followingId:AuthorId,
            followerId:userId,
        },
      });

      return NextResponse.json(FollowingAuthor);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error();
  }
}
