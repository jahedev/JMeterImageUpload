function validateForm() {
  var username = document.getElementById('username').value
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  var firstName = document.getElementById('firstName').value
  var lastName = document.getElementById('lastName').value

  var isValid = true

  // Username validation
  if (username.trim() === '') {
    document.getElementById('usernameError').innerHTML = 'Username is required'
    isValid = false
  } else {
    document.getElementById('usernameError').innerHTML = ''
  }

  // Email validation (optional)
  if (email.trim() !== '') {
    if (!validateEmail(email)) {
      document.getElementById('emailError').innerHTML = 'Invalid email address'
      isValid = false
    } else {
      document.getElementById('emailError').innerHTML = ''
    }
  }

  // Password validation
  if (password.trim() === '') {
    document.getElementById('passwordError').innerHTML = 'Password is required'
    isValid = false
  } else {
    document.getElementById('passwordError').innerHTML = ''
  }

  // First name validation
  if (firstName.trim() === '') {
    document.getElementById('firstNameError').innerHTML =
      'First name is required'
    isValid = false
  } else {
    document.getElementById('firstNameError').innerHTML = ''
  }

  // Last name validation
  if (lastName.trim() === '') {
    document.getElementById('lastNameError').innerHTML = 'Last name is required'
    isValid = false
  } else {
    document.getElementById('lastNameError').innerHTML = ''
  }

  return isValid
}

function validateEmail(email) {
  var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}
