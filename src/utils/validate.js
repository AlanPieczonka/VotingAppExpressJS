import { check } from 'express-validator/check';

export const validateEmail = email => check(email).isEmail().withMessage('must be an email');
export const validatePassword = password => check(password).isLength({ min: 6 }).withMessage('must be at least 6 characters long');
