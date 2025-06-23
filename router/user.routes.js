const router = require('express').Router()
const UserController = require('../controllers/user.controller')
router.get('/',UserController.showCreate)
router.post('/create',UserController.insert)
router.get('/list',UserController.list)
router.get('/edit/:id',UserController.edit)
router.post('/update/:id',UserController.update)
router.get('/delete/:id',UserController.delete)
module.exports = router