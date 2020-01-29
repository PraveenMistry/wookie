const express           = require('express');
const router            = express.Router();
const bookController    = require('./../controller/bookController');
const authMiddlerware   = require('./../middleware/authMiddleware');

// GET API`s
router.get('/books', authMiddlerware.auth, bookController.getBooks);
router.get('/book/serach', authMiddlerware.auth, bookController.serachBook);
router.get('/books/published', authMiddlerware.auth, bookController.getPublishedBooks);
router.get('/books/own/publish', authMiddlerware.auth, bookController.getOwnPublishedBooks);
router.get('/books/own/unpublished', authMiddlerware.auth, bookController.getOwnUnpublishedBooks);

// POST API`s
router.post('/book/publish', authMiddlerware.auth, bookController.publishBook);
router.put('/book/unpublish', authMiddlerware.auth,  bookController.unpublishBook);
router.put('/book/republish', authMiddlerware.auth, bookController.republishBook);
module.exports = router;