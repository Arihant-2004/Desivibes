import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

// Metadata generation for SEO
export async function generateMetadata({ params }) {
  const user = await getProfileByUsername(params.username);

  if (!user) return {};

  return {
    title: `${user.name ?? user.username} | Profile`,
    description: user.bio || `Check out ${user.username}'s profile and posts.`,
  };
}

// Server-side rendering of the profile page
export default async function ProfilePageServer({ params }) {
  const user = await getProfileByUsername(params.username);

  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}
