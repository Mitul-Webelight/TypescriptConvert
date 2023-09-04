export const messages = {
  Ok: 'Ok',
  Created: 'Created',
  upload: 'Upload Successfully',
  wordFileUpload: 'Please upload Word Documents',
  imageFileUpload: 'Please upload Images',
  pdfFileUpload: 'Please upload PDF Files',
  Bad_Request: 'Already Exist',
  Unauthorized: 'Unauthorized or Invalid Credentials',
  Invalid_Credentials: 'Email or Password Incorrect',
  Not_Found: 'Not Found',
  Server_Error: 'Internal Server Error',
  notFound: (value : string) => `${value} not found`,
};

export const statusCode = {
  Ok: 200,
  Created: 201,
  Bad_Request: 400,
  Unauthorized: 401,
  Not_Found: 404,
  Internal_Server_Error: 500,
};

export const constant = {
  user: 'USER',
  task: 'TASK',
};
