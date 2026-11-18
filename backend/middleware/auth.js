import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required.' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' });
  }
}

export function librarianOnly(req, res, next) {
  if (req.user?.role !== 'librarian') return res.status(403).json({ message: 'Librarian access only.' });
  next();
}
