"use strict";
/**
 * Get unique error field name
 */
const uniqueMessage = error => {
  let output;
  try {
    let fieldName = error.message.substring(
      error.message.lastIndexOf(".$") + 2,
      error.message.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }

  return output;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
  let message = error.message;

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        // message = { error: uniqueMessage(error), status: 400 };
        message = { error: "Email already Exists", status: 400 };
        break;
      default:
        message = { error: "" + error, status: 400 };
    }
  } else if (error.name === "CastError") {
    message = {
      error: "Invalid Id",
      status: 404
    };
  } else {
    for (let errorName in error.errors) {
      if (error.errors[errorName].message)
        message = { error: error.errors[errorName].message, status: 400 };
    }
  }

  return message;
};
