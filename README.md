# myTube - full stack video streaming app

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

## Features of the myTube App

### Video Browsing

![homepage](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-home.gif)
![video streaming](https://github.com/edward-designer/edward-designer.github.io/blob/main/images/c-video.gif)

### Image/Video Uploading and Adding Metadata

![dashboard](https://drive.google.com/file/d/1EsfvLD8pd2QtD1KCjmMCabj5pfaKXPvC/preview)
![video upload](https://drive.google.com/file/d/1yVwSM-1WxFkViTWeYyNA2nElTy1Zy1RP/preview)
![image upload](https://drive.google.com/file/d/1F0_b7q-gFldwOm2C9M72X5GyEja8OdXb/preview)

### Interactions - like/unlike/comment/add to playlists/follow

![like, unlik, follow](https://drive.google.com/file/d/1XPec3hNdgayvyrJcHH2OboDIbAxt02bU/preview)
![add to playlist](https://drive.google.com/file/d/1i_dAKw-IE2BNbd8Po-MzWTgtlGhQUYIr/preview)
![adding comments](https://drive.google.com/file/d/12R3OKsdwdBOvP3g8PBq2sIcIpcaWlMRl/preview)
![likes and history](https://drive.google.com/file/d/1PJbsJ0VZGsIbd2xn76paUbTpwt4tSAjx/preview)

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
