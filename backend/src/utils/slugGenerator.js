import slugify from 'slugify';

export const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export const generateUniqueSlug = async (Model, text, excludeId = null) => {
  let slug = generateSlug(text);
  let counter = 1;

  const query = { slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  let existing = await Model.findOne(query);

  while (existing) {
    slug = `${generateSlug(text)}-${counter}`;
    existing = await Model.findOne({ slug, ...(excludeId && { _id: { $ne: excludeId } }) });
    counter++;
  }

  return slug;
};

export default { generateSlug, generateUniqueSlug };