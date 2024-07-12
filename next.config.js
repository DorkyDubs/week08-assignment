module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

// This is limited to the two sites on vercel. Would like to open it up to allow images from anywhere, but haven't done so due to not being able to verify they are sanitary. This asepct aside imagine it could be done by using an array of all the submited images urls and using a function to slice them at the appropriate points ("https::/", "/" and possibly ".") to destrcture/isolate the hostname and then map through and create an image for each one.
