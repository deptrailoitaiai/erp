export function AnnualSubmitEmail(formId: string) {
    const form = `
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Annual Evaluation Notification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: auto;
              background: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2, h3 {
              text-align: center;
              color: #333;
          }
          p {
              font-size: 16px;
              color: #555;
              text-align: justify;
          }
          label {
              display: block;
              margin-bottom: 8px;
              font-weight: bold;
          }
          input[type="text"], input[type="email"], textarea {
              width: 100%;
              padding: 10px;
              margin-bottom: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
          }
          textarea {
              height: 100px;
          }
          button {
              display: block;
              width: 100%;
              padding: 10px;
              background: #5cb85c;
              color: white;
              border: none;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
          }
          button:hover {
              background: #4cae4c;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Annual Evaluation Notification</h2>
          <p>We hope this message finds you well.</p>
          <p>We are pleased to announce that the annual performance review form is now available. 
          Your feedback and self-evaluation are crucial in helping us recognize achievements and identify areas for growth. 
          Please take a moment to complete the form. 
          Your input will contribute to our ongoing efforts to support your development and enhance our team's performance.</p>
          <p>Please find the Annual Evaluation Form attached below:</p>
          <strong><a href="http://localhost:3000/forms/annual/${formId}/submit">http://localhost:3000/forms/annual/${formId}/submit</a></strong>
          <p>Thank you for taking the time.</p>
          <p>Best regards,</p>
      </div>
  </body>
  </html>
  `;
    return form;
  }
  