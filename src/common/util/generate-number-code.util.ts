import * as crypto from 'node:crypto';

const generateNumberCodeUtil = (digits: number) => {
  const codes: number[] = [];

  for (let i = 0; i < digits; i++) {
    codes.push(crypto.randomInt(1, 9));
  }

  return codes.join('');
};

export default generateNumberCodeUtil;
