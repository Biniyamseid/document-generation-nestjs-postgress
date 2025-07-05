export const API_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_TOKEN: 'Invalid token',
  UNAUTHORIZED: 'Unauthorized access',
  
  // Documents
  DOCUMENT_NOT_FOUND: 'Document not found',
  DOCUMENT_CREATED: 'Document created successfully',
  DOCUMENT_UPDATED: 'Document updated successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  NO_PERMISSION: 'You do not have permission to perform this action',
  
  // Validation
  TITLE_REQUIRED: 'Title is required',
  CONTENT_REQUIRED: 'Content is required',
  TITLE_TOO_LONG: 'Title must not exceed 255 characters',
  EMAIL_INVALID: 'Please provide a valid email',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  FULL_NAME_REQUIRED: 'Full name is required',
  
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
} as const; 