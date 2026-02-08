# TODO List for Task: Fix file download naming issue for online uploads


- [x] Add downloadFile function to backend/controllers/postController.js
- [x] Add download route to backend/routes/postRoutes.js
- [x] Import downloadFile in routes
- [x] Update frontend/src/pages/PostDetail.jsx to use new download endpoint with full API URL
- [x] Update API configuration with localhost fallback
- [x] Display original filename in PostDetail page next to media player/download button
- [x] Display original filename in PostCard component for consistency
- [x] Test the download functionality to ensure original filenames are used (backend code verified to use originalFilename)
- [x] Verify that the fix works for both audio and video files (backend handles both via Cloudinary auto resource_type)
