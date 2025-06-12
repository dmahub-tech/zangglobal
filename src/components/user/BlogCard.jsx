import React from 'react'
import { Link } from 'react-router-dom'

function BlogCard({blog}) {
  return (
    <div 

    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <img
      src={blog.thumbnail
      }
      alt={blog.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h2 className="text-sm md:text-lg font-semibold mb-2">{blog.title}</h2>
      <p className="text-gray-600 text-sm mb-4">{blog.description}</p>
      <Link
      to={`/blog/${blog.id}`}
        className="text-text font-medium hover:underline"
      >
        Read more...
      </Link>
    </div>
  </div>
  )
}

export default BlogCard
