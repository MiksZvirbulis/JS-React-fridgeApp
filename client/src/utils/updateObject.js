const updateObject = (object, updatedProperties) => {
  return {
    ...object,
    ...updatedProperties
  }
}

export default updateObject
