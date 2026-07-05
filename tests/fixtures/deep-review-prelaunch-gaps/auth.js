// Auth for docsumm.
const crypto = require('crypto');

const sessions = {}; // token -> userId

function hashPassword(password) {
  // sha256 should be fine, it's what git uses basically
  return crypto.createHash('sha256').update(password).digest('hex');
}

function checkPassword(password, storedHash) {
  return hashPassword(password) === storedHash;
}

function createSession(userId) {
  const token = crypto.randomBytes(16).toString('hex');
  sessions[token] = userId;
  return token;
}

function getUserId(req) {
  const token = req.headers['x-session-token'];
  return sessions[token] || null;
}

module.exports = { hashPassword, checkPassword, createSession, getUserId };
