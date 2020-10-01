
/**adding a create method to make a fetch call to the create API. */
const create = async (params, credentials, post) => {
/**This method, like the user edit fetch method, will send a multipart form submission
using a FormData object that will contain the text field and the image file. */
    try {
      let response = await fetch('/api/posts/new/'+ params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: post
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}


const listByUser = async (params, credentials) => {
    try {
      let response = await fetch('/api/posts/by/'+ params.userId, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/**Newsfeed API in the frontend to fetch the related posts and display
these posts in the Newsfeed view. */
const listNewsFeed = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/posts/feed/'+ params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })    
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/posts/' + params.postId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/**fetch method called like will be added to api-post.js, which
will be used when the user clicks the like button. */
const like = async (params, credentials, postId) => {
    try {
      let response = await fetch('/api/posts/like/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/**fetch method for unlike */
const unlike = async (params, credentials, postId) => {
  try {
    let response = await fetch('/api/posts/unlike/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, postId: postId})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

/**To use this API in the view, we will set up a fetch method in api-post.js, which
takes the current user's ID, the post ID, and the comment object from the view, and
sends it with the add comment request. */
const comment = async (params, credentials, postId, comment) => {
    try {
      let response = await fetch('/api/posts/comment/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/**fetch method, that takes the current user's ID, the post ID,
and the deleted comment object to send with the uncomment request. */
const uncomment = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch('/api/posts/uncomment/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  listNewsFeed,
  listByUser,
  create,
  remove,
  like,
  unlike,
  comment,
  uncomment
}

