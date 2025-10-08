'use strict';

// Drop zone
let globalSelectedAvatar = null;
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const errorMessageElement = document.getElementById('error-message');
const generateBtn = document.querySelector('.generate-btn');
const uploadSvg = document.querySelector('.upload-svg');
const imgControls = document.getElementById('image-controls');
const removeButton = document.getElementById('remove-btn');
const changeButton = document.getElementById('change-btn');
// ///////////////////////////////////////////////

// Input fields
const form = document.querySelector('.form');
const inputFields = document.querySelectorAll('.input-field');
const hiddenSpans = document.querySelectorAll('.hidden-span');
const fullNameInput = document.querySelector('.full-name-input');
const emailInput = document.querySelector('.email-input');
const usernameInput = document.querySelector('.username-input');
const displayFirstName = document.getElementById('display-first-name');
// ////////////////////////////////////////

// Success page
const successMessageContainer = document.getElementById(
  'success-message-container'
);
const description = document.querySelector('.description');
const avatar = document.querySelector('.avatar');
const imgColumnSpan = document.querySelector('.img-column-span');
const imgUsername = document.querySelector('.img-username');
const displayEmail = document.getElementById('display-email');
const monthSpan = document.querySelector('.month-span');
const daySpan = document.querySelector('.day-span');
const yearSpan = document.querySelector('.year-span');
const ticketNumber = document.querySelector('.ticket-number');
const spanJPG = document.querySelector('.span-jpg');
// ////////////////////////////////

// Adding and event listener to the parent container of the input, which also opens the user's file manager.
dropZone.addEventListener('click', () => {
  fileInput.click();
});
// //////////////////////////

// Adding an event listener to the fileInput element that listens for a change event. i.e when the user selects a picture. It passes the selected picture to the handleFiles function.
fileInput.addEventListener('change', event => {
  const files = event.target.files;
  handleFiles(files);
});
// //////////////////////////////////////////

// Adding an event listener to the dropZone, which is the parent container, to listen for any of the four drag and drop events.
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(
    eventName,
    event => {
      // Prevents the default behaviour of reloading
      event.preventDefault();
      // /////////////////////////////

      // This stops the click from being seen by the parent dropZone
      event.stopPropagation();
      // /////////////////////////
    },
    false
  );
});
// ///////////////////////////////////////

// Adding an event listener to the dropZone, which is the parent container, to listen for the 'drop' event.
dropZone.addEventListener('drop', event => {
  event.preventDefault();
  event.stopPropagation();
  dropZone.classList.remove('dragover');

  // Retrieves the dropped files

  const droppedFiles = event.dataTransfer.files;

  // ////////////

  // Passes the retrieved files to the handleFiles function for processing and displaying.
  handleFiles(droppedFiles);
  // /////////////////////
});

// Function to display error message
const displayError = function (message) {
  if (message) {
    errorMessageElement.textContent = message;
    errorMessageElement.hidden = false;
  } else {
    errorMessageElement.textContent = '';
    errorMessageElement.hidden = true;
  }
};
// /////////////////////////////

//  Function to clear error messages
const clearError = function () {
  errorMessageElement.textContent = '';
  errorMessageElement.hidden = true;
};
// //////////////////////////////////////

// Function to handle the uploading and displaying of the selected picture
const handleFiles = function (files) {
  // Clears error messages
  clearError();
  // /////////////////////////////////////////

  // If the length of the file is 0 or no file, the handleFiles function will not run
  if (!files || files.length === 0) {
    displayError('Error: No files were dropped');
    return;
  }
  // ///////////////////////////////////////////

  // This 'files' is basically the picture or the selected file that would be passed as an argument by any function that calls the handleFiles function
  const pictureFile = files[0];
  // /////////////////////////////////

  globalSelectedAvatar = pictureFile;

  const uploadLabel = document.getElementById('upload-label');
  const imagePreview = document.getElementById('image-preview');

  // If statement to check if the selected file format is a picture
  if (!pictureFile.type.startsWith('image/')) {
    displayError(
      'Error: Please upload a valid image file (JPG, PNG, GIF, etc).'
    );
    return;
  }

  // If statement to check if the selcted file is greater than 5MB
  if (pictureFile.size > 5 * 1014 * 1024) {
    displayError('Error: The image file is too large! Maximum size is 5MB');
    return;
  }

  // To show the name of the selected photo after loading it
  // uploadLabel.textContent = `${pictureFile.name}`;
  uploadLabel.textContent = '';
  // /////////////////////////////

  const reader = new FileReader();
  reader.onload = function (e) {
    // This is for the preview when the user selects a pictur
    imagePreview.src = e.target.result;
    // ///////////////////////////
    imagePreview.hidden = false;
    uploadSvg.style.display = 'none';

    // Show the buttons and its container
    imgControls.classList.add('active');
  };
  reader.readAsDataURL(pictureFile);
};
// //////////////////////////////////

// Adding an event listener to the change image button
changeButton.addEventListener('click', e => {
  //   This stop the default reload behaviour of the buttton
  e.preventDefault();

  //   This stops the click from being seen by the parent dropZone
  e.stopPropagation();
  fileInput.value = null;

  // This action simply opens the selector again
  fileInput.click();
});
// ///////////////////////////////////////////

// Adding an event liistener to the remove image button
removeButton.addEventListener('click', e => {
  //   This stop the default reload behaviour of the buttton
  e.preventDefault();

  //   This stops the click from being seen by the parent dropZone
  e.stopPropagation();

  const uploadLabel = document.getElementById('upload-label');
  const imagePreview = document.getElementById('image-preview');

  // Reset display and state
  imagePreview.src = '';
  imgControls.hidden = true;

  uploadSvg.style.display = 'block';
  imagePreview.hidden = true;

  //   Essential to allow re-uploading the same file
  fileInput.value = null;
  uploadLabel.textContent = ' Drag and drop or click to upload';
  uploadLabel.hidden = false;
  clearError();
});
// ////////////////////////////////////////

//  Function to check for input field errrors or validation.

const checkInputField = function () {
  let isValid = true;
  inputFields.forEach((input, index) => {
    const hiddenSpan = hiddenSpans[index];
    if (input.value.trim() === '') {
      hiddenSpan.style.display = 'block';
      hiddenSpan.style.fontSize = '13px';
      input.style.border = '1px solid red';
      input.classList.add('red-placeholder');
      isValid = false;
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      hiddenSpan.textContent = 'Please enter a valid email address!';
      hiddenSpan.style.display = 'block';
      input.classList.add('red-placeholder');
      input.style.border = '1px solid red';
    } else {
      hiddenSpan.style.display = '';
      input.style.border = '';
    }
  });
  return isValid;
};
// ////////////////////////////////////

// Email validation
const validateEmail = function (email) {
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
// ///////////////////////////////////

//  Adding an event listener to the input fields
inputFields.forEach(inputs => {
  inputs.addEventListener('input', checkInputField);
});
// // ///////////////////////////////

// Getting the date of today
const today = new Date();
const year = today.getFullYear();
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const month = monthNames[today.getMonth()];

const day = today.getDate();
// //////////////////////////

//  Adding an event listener to the generate ticket button
generateBtn.addEventListener('click', e => {
  // Prevents the default behaviour of reloading
  e.preventDefault();
  // ////////////////////

  displayError();

  const areFieldsValid = checkInputField();

  const selectedAvatar = globalSelectedAvatar;

  // Function to check if the  input fields are correctly filled out or empty
  if (!areFieldsValid) {
    spanJPG.textContent = '';
    return;
  }
  // ////////////////////////////////////////

  // To check if there is no selected avatar, then an error message should be displayed

  //  If statement to check if there is no selected avatar or picture or if it's not a picture file
  if (!selectedAvatar || !selectedAvatar.type.startsWith('image/')) {
    displayError(
      'Error: Please upload a valid image file (JPG, PNG, GIF, etc).'
    );
    return;
  }
  // //////////////////////////////////////

  displayError();

  form.classList.add('hidden');
  description.classList.add('hidden');
  displayFirstName.textContent = `${fullNameInput.value}`;
  displayEmail.textContent = `${emailInput.value}`;
  successMessageContainer.classList.add('active');
  imgColumnSpan.textContent = `${fullNameInput.value}`;
  imgUsername.textContent = `${usernameInput.value}`;
  monthSpan.textContent = `${month}`;
  yearSpan.textContent = `${year}`;
  daySpan.textContent = `${day}`;
  ticketNumber.textContent = generateTicketNumber();
  displayAvatar(selectedAvatar);
});
// ////////////////////////////////

// Function to display the selected avatar

const displayAvatar = function (file) {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      avatar.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    avatar.src = '';
  }
};
// /////////////////////////////////////

// Function to generate a 6-digit number with a '#' prefix

const generateTicketNumber = function () {
  // Generate a number between 0 (inclusive) and 1 (exclusive)

  // Multiply by 1,000,000 to get a number between 0 and 999,999
  const randomNumber = Math.floor(Math.random() * 1000000);

  // Pad the number with leading zeros to ensure it's always 6 digits
  const paddedNumber = String(randomNumber).padStart(6, '0');

  // Prefix with '#'
  return `#${paddedNumber}`;
};
