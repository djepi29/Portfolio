'use client'

import { useState } from 'react'
import Link from 'next/link'

const blogCategories = [
  { id: 'all', name: 'All Posts', count: 15 },
  { id: 'learning-apps', name: 'Learning Apps', count: 4 },
  { id: 'business-tools', name: 'Business Tools', count: 3 },
  { id: 'professional-solutions', name: 'Professional Solutions', count: 3 },
  { id: 'health-wellness', name: 'Health & Wellness', count: 2 },
  { id: 'seo-marketing', name: 'SEO & Marketing', count: 2 },
  { id: 'ottawa-business', name: 'Ottawa Business', count: 1 }
]

const blogPosts = [
  {
    id: 1,
    title: 'Turn Training PDFs into Interactive Courses: A Practical Playbook',
    excerpt: 'Learn how to transform static PDF documents into engaging, interactive learning experiences that improve retention and engagement.',
    category: 'learning-apps',
    readTime: '8 min read',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Reduce No-Shows by 30%: Reminder & Buffer Strategies That Work',
    excerpt: 'Proven strategies to minimize appointment cancellations and maximize your booking efficiency.',
    category: 'business-tools',
    readTime: '6 min read',
    date: '2024-01-12'
  },
  {
    id: 3,
    title: 'Fitness Coaches: Programs, Check-Ins, and Payment Plans—A Feature Blueprint',
    excerpt: 'Complete guide to building the perfect fitness coaching platform with all the features your clients need.',
    category: 'professional-solutions',
    readTime: '10 min read',
    date: '2024-01-10'
  },
  {
    id: 4,
    title: 'Privacy-First Health Apps: HIPAA-Ready Patterns for Small Teams',
    excerpt: 'How to build health and wellness apps that protect user privacy while delivering exceptional user experiences.',
    category: 'health-wellness',
    readTime: '12 min read',
    date: '2024-01-08'
  },
  {
    id: 5,
    title: 'Ottawa Small Business SEO: Quick Wins in 30 Days',
    excerpt: 'Local SEO strategies specifically designed for Ottawa businesses to improve their online visibility.',
    category: 'ottawa-business',
    readTime: '7 min read',
    date: '2024-01-05'
  }
]

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const selectedCategoryData = blogCategories.find(cat => cat.id === selectedCategory)

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Still Not Convinced?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Here are some blog posts on the subject that might help you understand the value I provide.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {blogCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.slice(0, 5).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${post.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Show More Button */}
        {filteredPosts.length > 5 && (
          <div className="text-center">
            <Link 
              href="/blog"
              className="btn-secondary"
            >
              View All {selectedCategoryData?.count} Posts
            </Link>
          </div>
        )}

        {/* Category Summary */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Showing {Math.min(5, filteredPosts.length)} of {selectedCategoryData?.count} posts in "{selectedCategoryData?.name}"
          </p>
        </div>
      </div>
    </section>
  )
}
