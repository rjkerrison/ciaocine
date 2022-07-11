const { isValidObjectId } = require('mongoose')

const findBySlugOrId = (model, idOrSlug) => {
  // This function must not use async await, because we must
  // return the full query so that additional query configuration can be done,
  // such as .populate(), .sort(), &c

  const slugFilter = { slug: idOrSlug }

  if (isValidObjectId(idOrSlug)) {
    const idFilter = { _id: idOrSlug }
    // isValidObjectId only checks that the id will not result in an error
    // when converted to an ObjectID, so we still need to check for a slug match
    return model.findOne({ $or: [idFilter, slugFilter] })
  }
  return model.findOne(slugFilter)
}

module.exports = {
  findBySlugOrId,
}
