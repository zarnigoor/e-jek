import { check } from 'express-validator';

export const validateLogin = [
  check('login', 'Login is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
];

export const validateApplication = [
  check('mutaxassislik', 'Mutaxassislik is required').not().isEmpty(),
  check('muammoTavsifi', 'Muammo tavsifi is required').not().isEmpty(),
];

export const validateStatusChange = [
  check('status', 'Status must be "bajarildi" or "amalga_oshirilmadi"').isIn(['bajarildi', 'amalga_oshirilmadi']),
];

export const validateUserCreation = [
  check('login', 'Login format must be "dom_uy" (e.g., 21_268)').matches(/^\d+_\d+$/),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('dom', 'Dom (building number) is required and must be a number').isInt({ min: 1 }),
  check('uy', 'Uy (house number) is required and must be a number').isInt({ min: 1 }),
];

export const validatePasswordChange = [
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
];
