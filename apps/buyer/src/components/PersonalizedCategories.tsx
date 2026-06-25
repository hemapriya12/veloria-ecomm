import Categories from "./Categories";

const PersonalizedCategories = async ({
  slugsPromise,
  limit,
}: {
  slugsPromise: Promise<string[] | null> | null;
  limit?: number;
}) => {
  const slugs = slugsPromise ? await slugsPromise : null;
  return <Categories personalizedSlugs={slugs ?? undefined} limit={limit} />;
};

export default PersonalizedCategories;
