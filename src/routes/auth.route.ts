import { Router } from 'express';
import * as authControllers from '../controllers/auth.controller';
import * as authSchemas from '../schemas/auth.schema';
import validate from '../middlewares/validation.middleware';

const authRouter = Router();

// Routes

authRouter.post('/signup', validate(authSchemas.signupSchema), authControllers.signup);
authRouter.post('/login', validate(authSchemas.loginSchema), authControllers.login);
authRouter.post('/forget-password', validate(authSchemas.forgetPasswordSchema), authControllers.forgetPassword);
authRouter.post('/verify-reset-code', validate(authSchemas.verifyPasswordSchema), authControllers.verifyPassResetCode);
authRouter.post('/reset-password', validate(authSchemas.resetPasswordSchema), authControllers.resetPassword);

export default authRouter;
