import jwt from 'jsonwebtoken';
import { isDev } from '../../env';

const handleJWTError = (err: unknown) => {
  let message = 'Authentication error';

  if (err instanceof jwt.TokenExpiredError) {
    console.log('JWT token expired:', err.message);

    message = isDev ? `JWT token expired: ${err.message}` : 'Your session has expired. Please log in again.';
  } else if (err instanceof jwt.JsonWebTokenError) {
    console.log('JWT malformed or invalid token:', err.message);

    message = isDev ? `JWT error: ${err.message}` : 'Invalid authentication token. Please log in again.';
  } else if (err instanceof jwt.NotBeforeError) {
    console.log('JWT not active yet:', err.message);

    message = isDev ? `JWT not active yet: ${err.message}` : 'This authentication token is not yet valid.';
  } else {
    console.log('Unexpected JWT error:', err instanceof Error ? err.message : 'Unknown JWT error');

    message = isDev
      ? `Unexpected JWT error: ${err instanceof Error ? err.message : 'Unknown JWT error'}`
      : 'An authentication error occurred. Please try again.';
  }

  return message;
};

export default handleJWTError;
