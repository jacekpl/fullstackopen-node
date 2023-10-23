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

    const reducer = (favourite, item) => {
        return favourite.likes > item.likes ? favourite : item
    }

    return blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
    if (!blogs.length) {
        return {}
    }

    let grouped = {};

    blogs.forEach(function (blog) {
        if (blog.author in grouped) {
            grouped[blog.author].blogs += 1;
        } else {
            grouped[blog.author] = {
                'author': blog.author,
                'blogs': 1
            }
        }
    })

    grouped = Object.values(grouped).sort((a, b) => b.blogs - a.blogs);
    return grouped[0];
}

const mostLikes = (blogs) => {
    if (!blogs.length) {
        return {}
    }

    let grouped = {};

    blogs.forEach(function (blog) {
        if (blog.author in grouped) {
            grouped[blog.author].likes += blog.likes;
        } else {
            grouped[blog.author] = {
                'author': blog.author,
                'likes': blog.likes
            }
        }
    })

    grouped = Object.values(grouped).sort((a, b) => b.likes - a.likes);
    return grouped[0];
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}