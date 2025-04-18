"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, Plus, Send, ThumbsUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@/contexts/user-context"
import { AndroidLayout } from "@/components/android-layout"

export default function ForumPage() {
  const { user } = useUser()
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:5001/api/forum', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setPosts(data.posts);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (err) {
        console.error("Failed to load posts:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, []) // Removed user?.token from dependencies since it's not used

  const handleCreatePost = async () => {
    if (!newPostTitle || !newPostContent) return

    setIsSubmitting(true)
    const token = sessionStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5001/api/add_forum_post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer `+token, // Assuming you have a user object with a token property
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Assuming the API returns the created post
        setPosts([data.post, ...posts]);
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostOpen(false);
      } else {
        console.error("Failed to create post");
      }
      setNewPostContent("")
      setNewPostOpen(false)
 {
      setIsSubmitting(false)
    }
  }catch (err) {
      console.error("Failed to create post:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendComment = async () => {
    if (!comment) return

    setIsSubmitting(true)

    try {
      // In a real app, this would send the comment to an API
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the first post with a new comment count
      const updatedPosts = [...posts]
      if (updatedPosts.length > 0) {
        updatedPosts[0].comments += 1
      }

      setPosts(updatedPosts)
      setComment("")
    } catch (err) {
      console.error("Failed to send comment:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AndroidLayout>
      <div className="flex flex-col min-h-[calc(100dvh-80px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center justify-between border-b border-cyan-900">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </Link>
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 text-cyan-400 mr-2" />
              <h1 className="text-xl font-bold text-cyan-400">Community Forum</h1>
            </div>
          </div>

          <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="bg-cyan-700 hover:bg-cyan-600 h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border border-cyan-900">
              <DialogHeader>
                <DialogTitle className="text-cyan-400">Create New Post</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <Input
                  placeholder="Title"
                  className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Share updates about road conditions, flooding, or other important information..."
                  className="bg-gray-800 border-gray-700 focus:border-cyan-500 min-h-[100px] text-white"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setNewPostOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    onClick={handleCreatePost}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 p-4 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
              <p className="text-cyan-300">Loading forum posts...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="bg-gray-900 border-cyan-900">
                <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-3">
                  <Avatar className={`h-8 w-8 bg-${post.author.color}-800`}>
                    <AvatarFallback className={`text-${post.author.color}-100`}>{post.author.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{post.author.name}</p>
                    <p className="text-xs text-gray-400">{post.time}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <h3 className="text-sm font-medium text-cyan-400 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-200">{post.content}</p>
                </CardContent>
                <CardFooter className="p-2 px-4 border-t border-gray-800 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.comments} comments</span>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No posts yet. Be the first to share information!</p>
            </div>
          )}
        </main>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Write a comment..."
              className="bg-gray-800 border-gray-700 focus:border-cyan-500 text-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendComment()
                }
              }}
            />
            <Button
              size="icon"
              className="bg-cyan-700 hover:bg-cyan-600 h-10 w-10 flex-shrink-0"
              onClick={handleSendComment}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </AndroidLayout>
  )
}

