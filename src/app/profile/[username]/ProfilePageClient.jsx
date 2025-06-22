"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
  CalendarIcon, EditIcon, FileTextIcon, HeartIcon, LinkIcon, MapPinIcon,
} from "lucide-react";

import { getProfileByUsername, getUserPosts, updateProfile } from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";

import PostCard from "@/components/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


function ProfilePageClient({ user, posts, likedPosts, isFollowing: initialIsFollowing }) {
  const { user: currentUser } = useUser();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses?.[0]?.emailAddress.split("@")[0] === user.username;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing((prev) => !prev);
    } catch {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated");
    }
  };

  return (
    <div className="max-w-3xl mx-auto grid gap-6">
      <div className="w-full max-w-lg mx-auto">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.image ?? "/avatar.png"} />
              </Avatar>
              <h1 className="mt-4 text-2xl font-bold">{user.name || user.username}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="mt-2 text-sm">{user.bio}</p>

              {/* Stats */}
              <div className="w-full mt-6 flex justify-between mb-4">
                <div>
                  <div className="font-semibold">{user._count.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <div className="font-semibold">{user._count.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <div className="font-semibold">{user._count.posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
              </div>

              {/* Follow/Edit Button */}
              {!currentUser ? (
                <SignInButton mode="modal">
                  <Button className="w-full mt-4">Follow</Button>
                </SignInButton>
              ) : isOwnProfile ? (
                <Button className="w-full mt-4" onClick={() => setShowEditDialog(true)}>
                  <EditIcon className="mr-2 size-4" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  className="w-full mt-4"
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                  disabled={isUpdatingFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}

              {/* Metadata */}
              <div className="w-full mt-6 space-y-2 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="size-4 mr-2" />
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center">
                    <LinkIcon className="size-4 mr-2" />
                    <a
                      href={
                        user.website.startsWith("http") ? user.website : `https://${user.website}`
                      }
                      className="hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarIcon className="size-4 mr-2" />
                  Joined {formattedDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Posts / Likes */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none p-0 bg-transparent h-auto">
          <TabsTrigger value="posts" className="px-6 font-semibold data-[state=active]:border-b-2 border-primary">
            <FileTextIcon className="size-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="likes" className="px-6 font-semibold data-[state=active]:border-b-2 border-primary">
            <HeartIcon className="size-4 mr-2" />
            Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          {posts.length ? (
            posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">No posts yet</div>
          )}
        </TabsContent>

        <TabsContent value="likes" className="mt-6">
          {likedPosts.length ? (
            likedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">No liked posts to show</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePageClient;
