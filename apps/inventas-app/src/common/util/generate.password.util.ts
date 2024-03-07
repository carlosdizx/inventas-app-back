const generatePasswordUtil = (len: number) => {
  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
  };

  let password = '';

  password +=
    charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  password +=
    charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  password +=
    charset.numbers[Math.floor(Math.random() * charset.numbers.length)];

  const allChars = charset.lowercase + charset.uppercase + charset.numbers;
  for (let i = password.length; i < len; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

export default generatePasswordUtil;
