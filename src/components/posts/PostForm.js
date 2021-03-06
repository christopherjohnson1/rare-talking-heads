import React, { useContext, useEffect, useState } from "react"
import { PostContext } from "./PostProvider"
import { CategoryContext } from "../categories/CategoryProvider"
import { TagContext } from "../tags/TagProvider"
import { TagBoxes } from "../tags/TagCheckbox"

export const PostForm = (props) => {
    const { createNewPost, updatePost, getAllPosts, posts } = useContext( PostContext )
    const { getAllCategories, categories } = useContext( CategoryContext )
    const { tags, getTags } = useContext(TagContext)
    const [selectedTags, setTags] = useState([])

    // Get all the categories to populate the select dropdown
    useEffect(() => {
        getAllCategories()
        getAllPosts()
        .then(getTags())
    }, [])

    
    
    // the following state is for compontent state
    const [post, setPost] = useState({})
    
    // is there a URL parameter of postId???
    const editMode = props.match.params.hasOwnProperty("postId") // true or false
    
    useEffect(() => {
        getPostInEditMode()
    }, [])

    // if in edit mode, get the post that matched the postId
    const getPostInEditMode = () => {
        if (editMode) {
            const postId = parseInt(props.match.params.postId)
            const postToEdit = posts.find(p => p.id === postId) || {}
            setPost(postToEdit)
        }
    }
    

    const handleControlledInputChange = (e) => {
        const newPost = Object.assign({}, post)     // Create a copy
        newPost[e.target.name] = e.target.value     // Modify copy
        setPost(newPost)
    }

    const constructNewPost = () => {
        if (editMode) {
            updatePost({
                id: post.id,
                title: post.title,
                content: post.content,
                image_url: post.image_url,
                category_id: parseInt(post.category_id),
                selected_tags: []
            })
                .then(() => props.history.push("/"))
        } else {
            createNewPost({
                title: post.title,
                content: post.content,
                publication_date: Date.now(),
                image_url: post.image_url,
                category_id: parseInt(post.category_id),
                approved: false,
                selected_tags: selectedTags
            })
                .then(() => props.history.push("/"))
        }
    }

    return (
        <form className="PostForm">
            <h3 className="PostForm__header text-center">{editMode ? "Edit Your Post" : "Create a New Post"}</h3>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title :</label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        placeholder="Post title"
                        defaultValue={post.title}
                        onChange={handleControlledInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="content">Content :</label>
                    <textarea type="text" name="content" rows="15" required autoFocus className="form-control"
                        placeholder="Post content"
                        defaultValue={post.content}
                        onChange={handleControlledInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="image_url">Header Image URL :</label>
                    <input type="text" name="image_url" required autoFocus className="form-control"
                        placeholder="Post header image URL"
                        defaultValue={post.image_url}
                        onChange={handleControlledInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="category_id">Category: </label>
                    <select name="category_id" className="form-control"
                        proptype="int"
                        value={post.category_id}
                        onChange={handleControlledInputChange}>

                            <option value="0">Select a category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                </div>
            </fieldset>

            <label>Tags: </label>
            <div className="tag-container">
                {
                    tags.map(t => <TagBoxes tag={t} selectedTags={selectedTags} setTags={setTags}  post={post} editMode={editMode} {...props} />)
                }
            </div>

            <button type="submit"
                onClick={e => {
                    e.preventDefault()
                    constructNewPost()
                }}
                className="btn btn-form btn-warning btn-sm mt-3">
                    {editMode ? "Save Updates" : "Save New Post"}
                </button>
        </form>
    )
}