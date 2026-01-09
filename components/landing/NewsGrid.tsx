import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NewsPost } from '@/lib/supabase/types';
import { getOptimizedImageProps } from '@/lib/utils/images';

interface NewsGridProps {
    posts: NewsPost[];
}

export function NewsGrid({ posts }: NewsGridProps) {
    if (!posts.length) {
        return (
            <div className="text-center py-12 text-text-secondary">
                <p>No mission updates available at this time.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
                const imageProps = post.cover_image
                    ? getOptimizedImageProps(post.cover_image, 'thumbnail')
                    : null;

                return (
                    <Link key={post.id} href={`/news/${post.slug}`} className="group block h-full">
                        <Card className="h-full border-transparent bg-transparent hover:border-border hover:bg-background-card hover:shadow-lg transition-all p-0 overflow-hidden">
                            <div className="aspect-video relative overflow-hidden rounded-t bg-background-secondary">
                                {imageProps ? (
                                    <Image
                                        alt={post.title}
                                        {...imageProps}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-background-secondary text-text-secondary/20">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                <div className="absolute top-4 left-4">
                                    <Badge variant={
                                        post.category === 'Announcement' ? 'tactical' :
                                            post.category === 'Update' ? 'success' : 'neutral'
                                    }>
                                        {post.category}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-xs text-text-secondary font-medium mb-3 uppercase tracking-wider">
                                    {new Date(post.published_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-text-accent transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-text-secondary line-clamp-2 text-sm">
                                    {/* Rudimentary excerpt if content is plain text, or just use a helper */}
                                    {post.content.substring(0, 120)}...
                                </p>
                            </div>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
