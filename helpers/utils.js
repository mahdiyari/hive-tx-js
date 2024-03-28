/** Return null for a valid username */
export const validateUsername = (username) => {
  let suffix = 'Account name should '
  if (!username) {
    return suffix + 'not be empty.'
  }
  const length = username.length
  if (length < 3) {
    return suffix + 'be longer.'
  }
  if (length > 16) {
    return suffix + 'be shorter.'
  }
  if (/\./.test(username)) {
    suffix = 'Each account segment should '
  }
  const ref = username.split('.')
  const len = ref.length
  for (let i = 0; i < len; i++) {
    const label = ref[i]
    if (!/^[a-z]/.test(label)) {
      return suffix + 'start with a letter.'
    }
    if (!/^[a-z0-9-]*$/.test(label)) {
      return suffix + 'have only letters, digits, or dashes.'
    }
    if (!/[a-z0-9]$/.test(label)) {
      return suffix + 'end with a letter or digit.'
    }
    if (!(label.length >= 3)) {
      return suffix + 'be longer'
    }
  }
  return null
}
