const { isValidObjectId } = require('mongoose')

const findBySlugOrId = (model, idOrSlug) => {
  return (
    (isValidObjectId(idOrSlug) && model.findById(idOrSlug)) ||
    model.findOne({ slug: idOrSlug })
  )
}

module.exports = {
  findBySlugOrId,
}
