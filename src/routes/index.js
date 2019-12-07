const userRouter = require('../routes/user');
const authRouter = require('../routes/authUser');


function router(app) {
  app.use(userRouter);
  app.use(authRouter);
}
module.exports = router