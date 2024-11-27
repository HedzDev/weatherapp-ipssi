function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    if (!body[field] || body[field] === "") {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { capitalize, checkBody };
