# MagicLetter

MagicLetter is an AI-powered application built with Vite (React TypeScript), Shadcn, and Firebase. It helps users generate personalized cover letters based on a job description, resume, and any additional instructions.

## Features

- **AI-Powered Cover Letter Generation**: Generates tailored cover letters using the provided job description, resume, and instructions.
- **User Authentication**: Secure authentication using Firebase.
- **Responsive Design**: User-friendly interface compatible with various devices.

## Technologies Used

- **Frontend**: Vite, React, TypeScript
- **UI Components**: Shadcn
- **Backend**: Firebase Authentication, Firestore
- **AI Integration**: OpenAI API (or any other AI service)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Firebase Account
- OpenAI API Key (or equivalent)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/tirdesh/magicletter.git
    cd magicletter
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up Firebase**:
    - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
    - Enable Authentication and Firestore Database.
    - Create a `.env` file in the root directory and add your Firebase configuration and OpenAI API key:
      ```plaintext
      VITE_FIREBASE_API_KEY=your_firebase_api_key
      VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
      VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
      VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
      VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
      VITE_FIREBASE_APP_ID=your_firebase_app_id
      VITE_OPENAI_API_KEY=your_openai_api_key
      ```

4. **Run the application**:
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## Usage

1. **Sign Up / Login**: Use Firebase Authentication to create an account or log in.
2. **Input Job Details**: Provide the job description, your resume, and any specific instructions.
3. **Generate Cover Letter**: Click the generate button to receive a tailored cover letter.
4. **Review & Edit**: Make any necessary edits before finalizing your cover letter.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please open an issue or reach out at tirdesh@gmail.com.

---