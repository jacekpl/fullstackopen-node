const dummy = (blogs) => {
    if (!blogs.length) {
        return 1
    }
}

const totalLikes = (blogs) => {
    if (!blogs.length) {
        return 0
    }

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs.length) {
        return {}
    }

    const reducer = (mostLiked, item) => {
        return mostLiked.likes > item.likes ? mostLiked : item
    }

    return blogs.reduce(reducer, blogs[0])
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}