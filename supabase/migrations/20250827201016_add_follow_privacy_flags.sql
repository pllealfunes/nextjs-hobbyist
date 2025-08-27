ALTER TABLE public."User"
ADD COLUMN is_followers_private BOOLEAN DEFAULT FALSE,
ADD COLUMN is_following_private BOOLEAN DEFAULT FALSE;