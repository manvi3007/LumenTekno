# Lumen Tekno - Electric Goods Sales & Customer Support

A modern, full-stack website for Lumen Tekno, a company specializing in wholesale and retail appliance sales with professional installation, after-sales service, and EV vehicle charging solutions.

## Features

### Backend (Node.js/Express)

- RESTful API with Express.js
- Nodemailer integration for email notifications
- Environment variable configuration
- CORS and JSON middleware
- Static file serving
- Comprehensive error handling
- Input validation and sanitization

### Frontend (HTML/CSS/JavaScript)

- Modern, responsive design
- Professional layout with hero section
- Services showcase (Wholesale, Retail, Installation, After-Sales Service)
- Contact form with real-time validation
- Mobile-friendly navigation
- Smooth animations and transitions

### Contact Form API

- **Endpoint**: `POST /api/contact`
- **Validation**: Name, Email, Phone, Message
- **Email**: Sends notifications to company Gmail
- **Response**: JSON success/error with detailed messages

## Project Structure

```
lumen-tekno/
├── server.js              # Express server
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── public/               # Frontend files
│   ├── index.html        # Main HTML file
│   ├── style.css         # CSS styles
│   └── script.js         # JavaScript functionality
└── README.md            # This file
```

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

1. Copy the environment variables template:

```bash
cp .env.example .env
```

2. Edit `.env` file with your Gmail credentials:

```env
# Server Configuration
PORT=5000

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=company-email@gmail.com
```

### 3. Create Gmail App Password

To use Gmail with Nodemailer, you need to create an App Password:

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Select "Mail" and generate a new app password
5. Use this 16-character password in your `.env` file (not your regular Gmail password)

**Note**: You must have 2-Factor Authentication enabled to create app passwords.

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check

- **GET** `/api/health`
- Returns server status and timestamp

### Contact Form

- **POST** `/api/contact`
- **Body**: JSON with `name`, `email`, `phone`, `message`
- **Response**: JSON with success status and message

**Example Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "message": "I need service for my refrigerator."
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon.",
  "messageId": "1234567890"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name must be at least 2 characters long",
    "Please provide a valid email address"
  ]
}
```

## Frontend Features

### Contact Form Validation

- Real-time field validation
- Client-side and server-side validation
- Error message display
- Loading states during submission
- Success/error feedback

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly navigation
- Optimized for all screen sizes

### Modern UI Elements

- Smooth animations
- Professional color scheme
- Clean typography
- Interactive elements

## Deployment

### Local Development

1. Install Node.js (version 14 or higher)
2. Clone the repository
3. Run `npm install`
4. Set up `.env` file
5. Start with `npm start`

### Production Deployment (Render.com)

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create Web Service**
   - New → Web Service
   - Connect your repository
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Environment Variables**
   - Add your environment variables in the Render dashboard:
     - `PORT` (optional, defaults to 10000 on Render)
     - `EMAIL_USER`
     - `EMAIL_PASS`
     - `EMAIL_TO`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

5. **Monitor**
   - Check logs in the Render dashboard
   - Verify the contact form works correctly

### Alternative Deployment Platforms

**Vercel (Frontend Only)**

- Deploy the `public/` folder as a static site
- Use a separate backend service for the API

**Heroku**

- Similar setup to Render
- Use Heroku environment variables

**DigitalOcean App Platform**

- Easy deployment with environment variable support

## Security Considerations

- **Environment Variables**: Never commit `.env` files to version control
- **Email Credentials**: Use app passwords, not regular passwords
- **Input Validation**: Both client and server-side validation implemented
- **CORS**: Properly configured for security
- **Error Handling**: Generic error messages in production

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Verify Gmail credentials and app password
   - Check if 2FA is enabled on Gmail account
   - Ensure "Less secure app access" is not required (use app passwords instead)

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Check for other running applications

3. **CORS Errors**
   - Ensure frontend and backend are on same domain in production
   - CORS is configured for development flexibility

4. **Form Validation Errors**
   - Check browser console for JavaScript errors
   - Verify all required fields are filled correctly

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## Technologies Used

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Nodemailer** - Email sending
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **Vanilla JavaScript** - No frameworks for simplicity
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Development Tools

- **Nodemon** - Auto-restart during development
- **Git** - Version control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support and questions:

- Check the troubleshooting section above
- Review the code comments for implementation details
- Ensure all dependencies are properly installed

## Future Enhancements

Potential improvements for future versions:

- Database integration for contact form submissions
- Admin dashboard for managing inquiries
- User authentication system
- Product catalog with e-commerce functionality
- Service booking system
- Customer portal for tracking service requests

---

**Lumen Tekno** - Your complete appliance solutions partner!
