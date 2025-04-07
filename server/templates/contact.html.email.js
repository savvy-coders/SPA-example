import html from "html-literal";

export default state => `
  <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Contact Message</title>
    </head>
    <body>
      <p>A message from ${state.name} (${state.email})</p>
      <p>${state.message}</p>
    </body>
  </html>
`;
