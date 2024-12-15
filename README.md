# License Plate Detector

## Project Overview

This project is a full-stack license plate detection application built with:
- Frontend: Next.js
- Backend: Python with OpenCV
- Real-time license plate recognition and processing

I could not get the demo working as I couldn't successfully ship python backend to railway/python anywhere.

## Prerequisites

- Python 3.8+
- Node.js 16+
- pip
- npm

## Local Setup

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/license-plate-detector.git
   cd license-plate-detector/backend
   ```

2. Create a virtual environment (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install Python dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server
   ```bash
   python app.py
   ```
   The backend will typically run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install npm dependencies
   ```bash
   npm install
   ```

3. Create environment configuration
   ```bash
   touch .env.local
   ```

4. Add backend URL to `.env.local`
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

5. Start the Next.js development server
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## Features

- Upload images for license plate detection
- Visualize detected license plates
- Export detection results

## Technology Stack

- **Frontend**: 
  - Next.js
  - React
  - Tailwind CSS

- **Backend**:
  - Python
  - OpenCV
  - Flask

## Common Issues & Troubleshooting

- Ensure all dependencies are installed
- Check that backend and frontend URLs match in `.env.local`
- Verify Python and Node.js versions
- Make sure no other services are running on ports 3000 and 5000
