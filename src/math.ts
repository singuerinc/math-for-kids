export const oneDigit = () => {
  const r = Math.random() * 10;
  return Math.floor(r);
};

export const twoDigits = () => {
  const r = 10 + Math.random() * 10;
  return Math.floor(r);
};
