import { Router } from 'express'

const router = Router()

/* Redirect to the real site */
router.get('/', async (req, res, next) => {
  res.redirect('https://www.ciaocine.com')
})

export default router
