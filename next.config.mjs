/** @type {import('next').NextConfig} */
const nextConfig = {
    images : {
        domains : ['firebasestorage.googleapis.com']
    },
    compiler : {
        styledComponents : true
    }
    // reactStrictMode : false,
    // reactStrictMode 기본값 : true
};

export default nextConfig;
