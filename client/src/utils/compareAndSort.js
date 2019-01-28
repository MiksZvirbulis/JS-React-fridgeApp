const compareAndSort = (oldObject, key, direction) => {

    let sortedObject = [...oldObject]
    
    sortedObject.sort((a, b) => {

        const nameA = (isNaN(a[key])) ? a[key].toUpperCase() : a[key]
        const nameB = (isNaN(b[key])) ? b[key].toUpperCase() : b[key]

        let comparison = 0

        if (nameA > nameB) {
            comparison = (direction === 'asc') ? 1 : -1;
        } else if (nameA < nameB) {
            comparison = (direction === 'asc') ? -1 : 1;
        }

        return comparison
    })
    return sortedObject
}

export default compareAndSort