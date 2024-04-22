const EMAIL_REG_EXP = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const MOBILE_REG_EXP = /^[6-9]\d{9}$/gi;

export const validateMobile = (mobile) => {
  if (mobile?.length < 0) return false;
  const mobileRegExp = new RegExp(MOBILE_REG_EXP);
  return mobileRegExp.test(mobile);
};

export function validateEmail(email) {
  if (email?.length < 0) return false;
  const emailRegExp = new RegExp(EMAIL_REG_EXP);
  return emailRegExp.test(email);
}
export function validateNumber(value) {
  if (!value || isNaN(value)) return false;
  return true;
}

export function validateRequired(value) {
  if (!value || value?.length === 0) return false;
  return true;
}
