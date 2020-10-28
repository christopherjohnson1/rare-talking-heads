import React, {useContext, useEffect, useState} from "react"

import {CategoryContext} from "./CategoryProvider"

export const CategoryForm = (props) => {
    const {createCategory, updatedCategory, category, setCategory} = useContext(CategoryContext)

    const [editMode, editModeChanged] = useState(false)

    const toEdit = props.match.params.hasOwnProperty("categoryId")

    

    useEffect(() => {
        
        if (toEdit) {
            console.log(toEdit)
            editModeChanged(true)
        }
        else {
            editModeChanged(false)
        }
    }, [category])

    // const catToEdit =() => {
    //     const categoryId = parseInt(props.match.params.categoryId)
    //     const selectedCat = categories.find
    // })
    

    const handleChange = (e) => {
        const newCategory = Object.assign({}, category)
        newCategory[e.target.name] = e.target.value
        setCategory(newCategory)
        
    }

    const makeNewCategory = () => {
        if(editMode) {
            updatedCategory({
                id : category.id,
                name : category.name
            }).then(props.history.push("/categories"))
        } else {
            createCategory({
                name : category.name
            }).then(props.history.push("/categories"))
        }
        setCategory({ name : ""})
    }

    return (
        <form className="CategoryForm">
            <h3 className="CategoryForm__title">{editMode ? "Update Category" : "Create Category"}</h3>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Name :</label>
                    <input type="text" name="name" required autoFocus className="form-control"
                        value={category.name}
                        onChange={handleChange}
                    />
                </div>
            </fieldset>
            <button type="submit"
                onClick={e => {
                    e.preventDefault()
                    makeNewCategory()
                }}
                className="btn btn-primary btn-form">
                    {editMode ? "Update" : "Save"}
                </button>
                <button className="btn btn-secondary" onClick={() => props.history.push('/categories')}>Cancel</button>
        </form>
    )


}