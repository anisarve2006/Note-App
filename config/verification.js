// In-memory Storage for verification code
const verificationCodes = new Map();
function storeVerificationCode(email, code) {
  verificationCodes.set(email, code);
  // Auto-delete code after 10 minutes
  setTimeout(() => verificationCodes.delete(email), 10 * 60 * 1000);
}
function getVerificationCode(email) {
  return verificationCodes.get(email);
}


function deleteVerificationCode(email) {
  verificationCodes.delete(email);
}

module.exports = {
    storeVerificationCode,
    getVerificationCode,
    deleteVerificationCode,
  };