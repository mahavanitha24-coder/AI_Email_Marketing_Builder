\# AI Email Marketing Builder



\## Project Overview

AI Email Marketing Builder is a web application that helps users create professional marketing emails using Artificial Intelligence. Users can enter product details, select their target audience, choose a campaign goal and tone, and generate customized marketing emails using Google Gemini AI.



\## Features



\- User Registration and Login

\- Secure Authentication using JWT

\- Password Hashing using bcrypt

\- AI Email Generation using Google Gemini

\- Multiple Email Tones

\- Campaign Creation and Management

\- Campaign Dashboard

\- Search and Sort Campaigns

\- Edit and Delete Campaigns

\- Copy Generated Emails

\- Download Generated Emails

\- MongoDB Database Integration

\- Responsive User Interface



\## Technologies Used



\### Frontend

\- React.js

\- Vite

\- JavaScript

\- CSS



\### Backend

\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT

\- bcrypt



\### Artificial Intelligence

\- Google Gemini API



\## Project Structure



```text

AI\_Email\_Marketing\_Builder/

├── client/

│   └── React frontend

├── server/

│   ├── routes/

│   ├── middleware/

│   ├── models/

│   └── server.js

├── .gitignore

└── README.md

```



\## Installation and Setup



\### 1. Clone the Repository



```bash

git clone YOUR\_GITHUB\_REPOSITORY\_URL

cd AI\_Email\_Marketing\_Builder

```



\### 2. Install Frontend Dependencies



```bash

cd client

npm install

```



\### 3. Install Backend Dependencies



```bash

cd ../server

npm install

```



\### 4. Configure Environment Variables



Create a `.env` file inside the server folder.



Add your own configuration:



```env

PORT=5000

MONGO\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_jwt\_secret

GEMINI\_API\_KEY=your\_gemini\_api\_key

```



Never upload your actual `.env` file or API keys to GitHub.



\### 5. Run the Backend



From the server folder:



```bash

node server.js

```



\### 6. Run the Frontend



Open another terminal:



```bash

cd client

npm run dev

```



Open the local URL displayed in the terminal.



\## Application Workflow



1\. Register a new account.

2\. Log in securely.

3\. Open the Campaign Builder.

4\. Enter product details.

5\. Select the target audience.

6\. Choose the campaign goal and email tone.

7\. Generate an AI-powered marketing email.

8\. Copy or download the generated email.

9\. Save and manage campaigns through the dashboard.



\## Future Enhancements



\- Email delivery integration

\- Campaign performance analytics

\- Email templates

\- Advanced audience segmentation



\## Author



\*\*Joyice Neelavathy G\*\*



B.Tech Information Technology



\## License



This project is developed for educational and portfolio purposes.



