const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// === CONFIGURE THESE ===
const SUPABASE_URL = 'https://obdjdufpascluwlgypup.supabase.co';
const BUCKET = 'resumes';
const FOLDER = 'resumes';
const USER_ID = '927951c7-639c-4810-90a5-84d0e091315e'; // <-- fill in your user id
const FILE_PATH = './test.txt'; // <-- path to a test file on your disk
const FILE_NAME = 'test.txt'; // name to use in storage
const JWT = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkdyNjY3dUoxT3lUTzczQUEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL29iZGpkdWZwYXNjbHV3bGd5cHVwLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5Mjc5NTFjNy02MzljLTQ4MTAtOTBhNS04NGQwZTA5MTMxNWUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUzMDMxOTA1LCJpYXQiOjE3NTMwMjgzMDUsImVtYWlsIjoiY2xlbWVudGhlb2JlbmF5YUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0kwR2VpTnZLazUxaFRHNnQ0ZzV1UDBHQmotUmRmNFowYW5GT21YRUdWT2syZkp5UTlKMHc9czk2LWMiLCJlbWFpbCI6ImNsZW1lbnRoZW9iZW5heWFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkNsZW1lbnRoZW8gU2lsaXRvbmdhIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwibmFtZSI6IkNsZW1lbnRoZW8gU2lsaXRvbmdhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSTBHZWlOdktrNTFoVEc2dDRnNXVQMEdCai1SZGY0WjBhbkZPbVhFR1ZPazJmSnlROUowdz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTEyNTY1NTk3NzAzOTQ4MjMyMDY2Iiwic3ViIjoiMTEyNTY1NTk3NzAzOTQ4MjMyMDY2In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NTI5NDY0NDV9XSwic2Vzc2lvbl9pZCI6IjNjNDcwYjQ0LTZkOWYtNDA5YS1iMWZjLTBhY2JjNWRiZDk0YyIsImlzX2Fub255bW91cyI6ZmFsc2V9.KU0St50MOBYDH0YUEDTfVLXYhEM1niU1yyH5W8c7NmM'; // <-- fill in your full JWT

// === DO NOT EDIT BELOW ===
const form = new FormData();
form.append('file', fs.createReadStream(FILE_PATH));

const uploadPath = `${FOLDER}/${USER_ID}/${FILE_NAME}`;
const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${uploadPath}`;

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${JWT}`,
    ...form.getHeaders(),
  },
  body: form,
})
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(({ status, data }) => {
    console.log('Status:', status);
    console.log('Response:', data);
  })
  .catch(err => {
    console.error('Error:', err);
  }); 