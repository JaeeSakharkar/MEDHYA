// Utility function to check if user is admin
function isAdmin(user) {
  const userGroups = user['cognito:groups'] || [];
  return userGroups.includes('admin');
}

// Utility function to get user ID from JWT
function getUserId(user) {
  return user.sub;
}

// Utility function to get user email from JWT
function getUserEmail(user) {
  return user.email;
}

module.exports = {
  isAdmin,
  getUserId,
  getUserEmail
};