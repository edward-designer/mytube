# [myTube](https://mytubeuk.vercel.app/)- full stack video streaming app

The myTube App is a full stack video streaming app similar to YouTube created using the [T3 Stack](https://create.t3.gg/) featuring the following technologies:

- Next.js
- NextAuth.js
- Prisma
- Tailwind CSS
- tRPC
- React Query
- TypeScript

Online platform used:

- hosting: [Vercel](https://vercel.com/)
- database: [PlanetScale](https://app.planetscale.com/)
- Video/Image: [Cloudinary](https://cloudinary.com/)

This app is based on the [tutorial by Jerome McCree](https://www.vidchill.org/) with lots of customizations and enhancements:

- **UX of homepage**
  - infinite scrolling for videos (via useInfiniteQuery and Intersection Observer)
- **UX of image/video upload / update**
  - steps of video upload
  - use of auto-generated video thumbnail
  - debounced auto save of video meta data
  - image upload hook
  - error handling
  - skeleton loading
- **UX of user input**
  - partial hiding of long video descriptions
  - auto expansion of textarea height based on input length
  - _optimistic update_ for commenting
- **Visual design**
  - auto minimize of sidebar
  - animated like/dislike icons
  - responsive layout
  - History and Liked pages
- **Security**
  - userId is got directly from db rather than supplying through API payload
- **SEO**
  - optimised response image delivery with priority fetching for above the fold images
  - title tags

## Features of the myTube App

### Video Browsing

- Homepage
  ![homepage](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-home.gif)
- Video
  ![video streaming](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-video.gif)

### Image/Video Uploading and Adding Metadata

- Dashboard
  ![dashboard](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-dashboard.gif)
- Video Upload
  ![video upload](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-uploadVideo.gif)
- Image Upload
  ![image upload](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-uploadImage.gif)

### Interactions - like/unlike/comment/add to playlists/follow

- Like, Unlike and Follow
  ![like, unlik, follow](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-like.gif)
- Add Video to Playlist
  ![add to playlist](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-playlist.gif)
- Add Comments
  ![adding comments](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-comment.gif)
- Liked Video and History
  ![likes and history](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-history.gif)

## Installation

1. Clone the project repository and pull to local environment

2. Create a `.env` file in the root directory and add the following

```
# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
# Create an account on [PlanetScale](https://app.planetscale.com/) and create a new database (for storing user and video data)
DATABASE_URL=''

# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Next Auth Email Provider (to send out emails with magic links for logging in)
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=
EMAIL_FROM=""

# Cloudinary
# Create an cloudinary account and get the public name (for storage of video/image uploads)
NEXT_PUBLIC_CLOUDINARY_NAME="deh6cggus"

```

3. Set up the database and send the dummy data

```
npm run db:push
npm run postinstall
npx prisma db seed

```

4. Install dependencies and run the dev server

```
npm install
npm run dev

```

5. For the database client Prisma Studio, run the following command:

```
npx prisma studio
```
