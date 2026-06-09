const checkAuth= require('../middleware/checkAuth')
const {updateProfile,me, getProfile} = require('../controller/profile.controller')
const router = require('express').Router()
const upload = require('../middleware/upload')
router.get('/me',checkAuth,me)
router.get('/:id',getProfile)
router.put('/update',checkAuth,upload.single("avatar"),updateProfile)

module.exports = router