const maskEmail = (email) => {
  const [username, domain] = email.split("@");

  if (username.length <= 2) {
    return username[0] + "***@" + domain;
  }

  const visiblePart = username.slice(0, 3);
  return `${visiblePart}***@${domain}`;
};

module.exports = {
  maskEmail,
};
