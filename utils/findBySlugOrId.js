const { isValidObjectId } = require('mongoose')

const findBySlugOrId = async (model, idOrSlug) => {
  return (
    (isValidObjectId(idOrSlug) && (await model.findById(idOrSlug))) ||
    (await model.findOne({ slug: idOrSlug }))
  )
}

module.exports = {
  findBySlugOrId,
}
