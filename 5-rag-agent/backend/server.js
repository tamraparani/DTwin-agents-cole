const express = require('express');
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const { Readable } = require('stream');

const CREDENTIALS = {
  client_email: "erinnern@erinnern-441514.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzqaCSLN6jMOm8\nliB5SAZZS9eEGXyE96V3FklV/5eysxht9zb/mG559m6wdOycir7yTnzwVc8kwoYC\n2cIdco7deioS3hm6M/Sb6q6VWRWW0aXTWN9izdODqf2tHWqy74UntoXaTpm6kzZX\nQLYBRNLgk8nJblz7hkZv4S7PmMybmNwKzNHP1ieF0wCq3+2qXMpyjWVxg3j0+N3X\nUDkhcxCehYZCy9OIe1P10p6eimB14JZAYyEVkkUlyAXQFjFgIdqYQ9G/D7+7zogN\noy0JdSEqbFsEcPwOgHmRO8ke7DPxZHWJsMoNs8W8gBBSX/plmAkRfGIHgp3eEMps\nu+19299bAgMBAAECggEAFslUzDVUp230ty5zP+6an4i29NImsNaX7dqtwnKAUvHU\nD15jY1d5644Ny+OIfvI59ZFu1yyK8SaayJHFxOZaqExuOaZhrPQZ+gxxyA9cZZyB\nY6TJ8EYapYBR5Dru5XLreHX11BJT/Q3evoI+kzqfZExaM2oD8QK+vEHbJglDKhiq\nhsyisDu1XnEmDBpTUd1xdn6v2E3x9SdEMWnh9yLkGfSDNvp3ZhOOPJ0fRm02zqgK\n4ghUV20nsQeo8CNsTZYwIwjsFCEzdhbbEePfVsIXod8dp3palsoEXJpG5asq5m2j\nFmvZdwuv/CBFnjrmNP0TjtQGKjmZoeG7of/ZBfkLwQKBgQDmFhM7sMMGY8z/rJqF\n7jE4JrcoaDmJqKTxZHVO4HXBKecvzCMP1o1qOy523qjJgOD5uMZmO4svzLTT5kxq\nWJPhFCEHMRkrdg2HNAfd+Nt8oud1qk3xiZy/z1y/+krvy29DsFMCdtGd2vpEvW66\na5Uuiyc8A0dt0C8ok7e0Prl+5wKBgQDH5biOFkEILmN+faTGtnrOimpe0qh6qO7c\nqKCpqwjKgG0lkhR8t8Bxu0bmWMBpgH23UooN5JONpH2TPmmMW39C5ycB1j1OUcF1\n3NejAMl9+GeXCwuR/7JZtRnQuKWvCF/V0gHhH/bh6WY0GP3s8kWb0jvc5HQ7R+0K\n8Q47iACRbQKBgEippg9OxniJIh+IihBL5f1etK8tIyanPNgDKszrNCT5r8o3hMcm\nsehfok/mB5YDfok+4mE84rsIwf69l1pqeOE3MysLRXClSqZtNyLRybc11zUgwJbM\nJ9WnjhoO2IWcUJom4EBB9/cLRchZrtNu0GEvjwdz3aX/fjUpWXWx7XD3AoGBAJ3r\n1zyxShkrhMDGhCnUufp4EYbuB9o3odVDhwHjtCM/CHt5B6RsCqYPHPkXvpLaxvbQ\nR26oWQW6oNZ1pS8UjdqOARwLZA1+u0bg/J6zHXvehgAm4rIp/n2ufEGPzp0UEZo7\nue5fsUxSdsLLx7eswt9SXKaq+URoE1XkkKjpTgGVAoGBANYQqlRVe+TBGLdU6+Nv\nNrgrzj0B2teuL6oXj1hQikPiBMQbqV70pUk0hfhP5e9FBwgfQw3su6bEJsOBGgN/\n02cLgVRUjTEfTRuCR3v7dmx5SPpoYZepFCWym3W/2emX1v/L/0BnTQpJFi3b4sNY\nL9mD/2kCAt2sMimUgE4JvTsR\n-----END PRIVATE KEY-----\n"
};

const FOLDER_ID = '13120ffvmMyHZEi4SuUIA-ddvFJuxzRdy';

app.post('/api/upload-to-drive', async (req, res) => {
  try {
    const { stringContent,fileDescription } = req.body;
    console.log('content:', stringContent);
    console.log('fileDescription:', fileDescription);
    let descriptionString = fileDescription.description;
    const parsedDescription = JSON.parse(descriptionString);
    descriptionString = JSON.stringify(parsedDescription, null, 2);
    const auth = new JWT({
      email: CREDENTIALS.client_email,
      key: CREDENTIALS.private_key,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: `erinnern-digital-twin-profile-${new Date().toISOString()}.txt`,
      parents: [FOLDER_ID],
      description:descriptionString

    };

    const media = {
      mimeType: 'text/plain',
      body: stringContent,


    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,description',
    });

    res.json({ fileId: response.data.id });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
