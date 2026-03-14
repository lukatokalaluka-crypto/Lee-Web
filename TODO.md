# TODO List: Fix file download naming issue for online uploads

✅ [Done] Step 1: Analyzed relevant files (postController.js, postRoutes.js, model, PostDetail.jsx)
✅ [Done] Step 2: Created comprehensive edit plan and got user confirmation
✅ [Done] Step 3: Implemented improvements to resolveDownloadFilename in postController.js (async HEAD for content-type, better mime mapping for online uploads)
✅ [Done] Step 4: Verified edits (logic added for robust filename resolution even for online uploads without originalFilename)
✅ [Done] Step 5: Task complete - file downloads now use proper names via stored original, URL parse, or content-type detected ext + title fallback


