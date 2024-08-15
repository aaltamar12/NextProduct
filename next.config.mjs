/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "flagpedia.net",
      "images.ctfassets.net",
      "img.freepik.com",
      "landing-trd.s3.us-east-2.amazonaws.com",
    ],
  },
  env: {
    NEXT_FRONTEND_URL: process.env.NEXT_FRONTEND_URL,
    NEXT_BACKEND_URL: process.env.NEXT_BACKEND_URL,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_ACCESS_ID: process.env.AWS_ACCESS_ID,
    AWS_SECRET_ACCESS: process.env.AWS_SECRET_ACCESS,
    AWS_REGION: process.env.AWS_REGION,
  },
};

export default nextConfig;
