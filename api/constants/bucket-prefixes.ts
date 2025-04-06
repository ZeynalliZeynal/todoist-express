export enum BUCKET_PREFIXES {
  AVATARS = "avatars",
  FEEDBACKS = "feedbacks",
}

export const isValidBucketPrefix = (value: string): value is BUCKET_PREFIXES =>
  Object.values(BUCKET_PREFIXES).includes(value as BUCKET_PREFIXES);
