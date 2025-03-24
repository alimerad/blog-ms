import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';


const app = express();
const PORT = process.env.PORT || 8080;



console.log({port: process.env.API_URL})
// Proxy vers le service Utilisateurs
app.use('/users', createProxyMiddleware({
  target: 'http://users-service:3000',
  changeOrigin: true,
  pathRewrite: { '^/users': '' },
}));

app.use(
  "/posts",
  createProxyMiddleware({
    target: "http://posts-service:3000", // service posts dans Docker Compose
    changeOrigin: true,
    pathRewrite: { "^/posts": "" }, // supprime le préfixe "/posts"
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying: ${req.method} ${req.originalUrl} to ${proxyReq.getHeader("host")}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`Response: ${req.method} ${req.originalUrl} with status ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`Error during proxying ${req.method} ${req.originalUrl}:`, err);
    }
  })
);

// Proxy vers le service Commentaires
app.use('/comments', createProxyMiddleware({
  target: 'http://comments-service:3000',
  changeOrigin: true,
  pathRewrite: { '^/comments': '' },
}));



app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
