import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wsxubmkeeuauyxvepfmj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeHVibWtlZXVhdXl4dmVwZm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MDUxNjksImV4cCI6MjA2MzM4MTE2OX0.TxGjjiWwKuukfLtn-xoQWuOxnn57HxlhsM2S0aztcJ4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Video = {
  id: string
  title: string
  description?: string
  user_id: string
  storage_path: string
  thumbnail_url?: string
  created_at: string
  updated_at: string
  duration?: number
  size: number
  status: 'processing' | 'ready' | 'error'
}

export const uploadVideo = async (
  file: File,
  title: string,
  userId: string,
  onProgress?: (progress: number) => void
) => {
  try {
    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    // 2. Create video record in the database
    const { data: videoData, error: dbError } = await supabase
      .from('videos')
      .insert({
        title,
        user_id: userId,
        storage_path: filePath,
        size: file.size,
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Since we can't track progress directly, we'll simulate it
    // This is a workaround since Supabase doesn't support progress tracking
    if (onProgress) {
      // Simulate progress in chunks
      const chunkSize = file.size / 10
      for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        onProgress(i * 10)
      }
    }

    return videoData
  } catch (error) {
    console.error('Error uploading video:', error)
    throw error
  }
}

export const getVideos = async (userId: string) => {
  try {
    console.log('Fetching videos for user:', userId);
    
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Fetched videos:', data);
    return data as Video[];
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export const getVideo = async (videoId: string) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single()

    if (error) throw error
    return data as Video
  } catch (error) {
    console.error('Error fetching video:', error)
    throw error
  }
}

export const deleteVideo = async (videoId: string, storagePath: string) => {
  try {
    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('videos')
      .remove([storagePath])

    if (storageError) throw storageError

    // 2. Delete from database
    const { error: dbError } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)

    if (dbError) throw dbError
  } catch (error) {
    console.error('Error deleting video:', error)
    throw error
  }
}

export const getVideoUrl = async (storagePath: string) => {
  try {
    // First try to get a signed URL for secure access
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('videos')
      .createSignedUrl(storagePath, 3600) // URL valid for 1 hour

    if (signedUrlError) {
      // If signed URL fails, fall back to public URL
      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(storagePath)
      return publicUrlData.publicUrl
    }

    return signedUrlData.signedUrl
  } catch (error) {
    console.error('Error getting video URL:', error)
    throw error
  }
}

export const downloadVideo = async (storagePath: string, fileName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('videos')
      .download(storagePath)

    if (error) throw error

    // Create a blob URL and trigger download
    const blob = new Blob([data], { type: 'video/mp4' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error downloading video:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
} 