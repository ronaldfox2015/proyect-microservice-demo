export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  algorithm: 'HS512',
}
