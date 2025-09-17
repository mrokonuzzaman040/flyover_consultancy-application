'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Blog, UpdateBlogRequest, blogCategories } from '@/lib/models/Blog';
import { toast } from 'sonner';
import ImageBBUpload from '@/components/admin/ImageBBUpload';
import Image from 'next/image';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<UpdateBlogRequest>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: [],
    image: '',
    featuredImage: '',
    featured: false,
    status: 'draft'
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`);
      const data = await response.json();
      
      if (data.success) {
        const blogData = data.blog;
        setBlog(blogData);
        setFormData({
          title: blogData.title || '',
          content: blogData.content || '',
          excerpt: blogData.excerpt || '',
          author: blogData.author || '',
          category: blogData.category || '',
          tags: blogData.tags || [],
          image: blogData.image || '',
          featuredImage: blogData.featuredImage || '',
          featured: blogData.featured || false,
          status: blogData.status || 'draft'
        });
      } else {
        toast.error('Blog not found');
        router.push('/admin/blogs');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to fetch blog');
      router.push('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateBlogRequest, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (image: { url: string; name: string; size: number }) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: image.url
    }));
    toast.success('Image uploaded successfully!');
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: ''
    }));
    toast.success('Image removed successfully!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.content?.trim()) {
      toast.error('Content is required');
      return;
    }
    if (!formData.author?.trim()) {
      toast.error('Author is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          status
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Blog ${status === 'published' ? 'published' : 'updated'} successfully`);
        // Refresh the blog data
        await fetchBlog();
      } else {
        toast.error(data.error || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Blog deleted successfully');
        router.push('/admin/blogs');
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Blog not found</h3>
          <p className="text-gray-500 mb-4">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1">Update your blog post</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {blog.status === 'published' && (
            <Link href={`/blogs/${blog.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Live
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            {deleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter blog title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the blog post"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Author name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Featured Image</Label>
                <ImageBBUpload
                  onUpload={handleImageUpload}
                  onRemove={handleImageRemove}
                  currentImage={formData.featuredImage}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your blog content here..."
                rows={20}
                className="min-h-[500px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Status: <span className="font-medium">{blog.status}</span></p>
                {blog.publishedAt && (
                  <p>Published: {new Date(blog.publishedAt).toLocaleDateString()}</p>
                )}
                <p>Last updated: {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleSubmit('draft')}
                  disabled={saving}
                  variant="outline"
                  className="w-full"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save as Draft
                </Button>
                
                <Button
                  onClick={() => handleSubmit('published')}
                  disabled={saving}
                  className="w-full bg-brand-600 hover:bg-brand-700"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {blog.status === 'published' ? 'Update' : 'Publish Now'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="mt-1">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {(formData.tags?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(formData.tags || []).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-brand-100 text-brand-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-brand-600 hover:text-brand-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              {formData.image && (
                <div className="mt-3">
                  <Image
                    width={400}
                    height={300}
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}