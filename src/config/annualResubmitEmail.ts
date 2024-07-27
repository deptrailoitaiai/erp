export function AnnualResubmitEmail(formId: string) {
    const form = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Annual Evaluation Resubmission</title>
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
                  background: #d9534f;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  font-size: 16px;
                  cursor: pointer;
              }
              button:hover {
                  background: #c9302c;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Annual Evaluation Resubmission Required</h2>
              <p>Dear Employee,</p>
              <p>We have reviewed your recent submission of the Annual Evaluation Form and found that some information was either missing or incorrect. To ensure a comprehensive and accurate evaluation, we kindly ask you to resubmit the form with the correct information.</p>
              <p>Please use the link below to access and complete the resubmission form:</p>
              <strong>http://localhost:3000/forms/annual/${formId}/submit</a></strong>
              <p>Thank you for your prompt attention to this matter.</p>
              <p>Best regards,</p>
              <p>Your Company Name</p>
          </div>
      </body>
      </html>
    `;
    return form;
  }
  