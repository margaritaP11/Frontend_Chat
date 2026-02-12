import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Explore.css'

export default function Explore() {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadExplore = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/posts/explore', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        let data = await res.json()
        console.log('EXPLORE DATA:', data)

        if (data.posts) {
          data = data.posts
        }

        if (Array.isArray(data)) {
          data = data.sort(() => Math.random() - 0.5)
          setPosts(data)
        } else {
          console.error('Explore API returned NOT an array:', data)
        }
      } catch (err) {
        console.error('EXPLORE LOAD ERROR:', err)
      }
    }

    loadExplore()
  }, [])

  return (
    <div className="explore-grid">
      {posts.map((post) => (
        <div
          key={post._id}
          className="explore-item"
          onClick={() => navigate(`/profile/${post.user._id}`)}
        >
          <img src={post.image} alt="" />
        </div>
      ))}
    </div>
  )
}
