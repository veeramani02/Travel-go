export const generateVoucherCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);

  return `TRIP${random}${timestamp}`;
};