import React from 'react'
import PropTypes from 'prop-types'
import Post from './Post'

export default function PostList (props) {
    return(
        <div style={{marginTop: '24px'}}>
{/* The PostList component will iterate through the list of posts passed to it as props
from the Newsfeed or the Profile, and pass the data of each post to a Post
component that will render details of the post. */}
            {props.posts && props.posts.map((item, i) => {
/**PostList will also pass the
removeUpdate function that was sent as a prop from the parent component to the
Post component so that the state can be updated when a single post is deleted. */
                return <Post  post={item} key={i} onRemove={props.removeUpdate}/>
            })
            }
      </div>
    )
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
}


