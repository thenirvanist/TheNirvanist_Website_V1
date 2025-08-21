// Netlify Functions entry point
import express from 'express';
import serverless from 'serverless-http';
import { storage } from './storage.js';
import { authenticateToken, hashPassword, generateToken, verifyPassword } from './auth.js';
import { chatWithOpenAI } from './openai.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Routes
app.get('/api/journeys', async (req, res) => {
  try {
    const journeys = await storage.getJourneys();
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ message: 'Failed to fetch journeys' });
  }
});

app.get('/api/journeys/:id', async (req, res) => {
  try {
    const journey = await storage.getJourney(parseInt(req.params.id));
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }
    res.json(journey);
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ message: 'Failed to fetch journey' });
  }
});

app.get('/api/sages', async (req, res) => {
  try {
    const sages = await storage.getSages();
    res.json(sages);
  } catch (error) {
    console.error('Error fetching sages:', error);
    res.status(500).json({ message: 'Failed to fetch sages' });
  }
});

app.get('/api/sages/:id', async (req, res) => {
  try {
    const sage = await storage.getSage(parseInt(req.params.id));
    if (!sage) {
      return res.status(404).json({ message: 'Sage not found' });
    }
    res.json(sage);
  } catch (error) {
    console.error('Error fetching sage:', error);
    res.status(500).json({ message: 'Failed to fetch sage' });
  }
});

app.get('/api/ashrams', async (req, res) => {
  try {
    const ashrams = await storage.getAshrams();
    res.json(ashrams);
  } catch (error) {
    console.error('Error fetching ashrams:', error);
    res.status(500).json({ message: 'Failed to fetch ashrams' });
  }
});

app.get('/api/ashrams/:id', async (req, res) => {
  try {
    const ashram = await storage.getAshram(parseInt(req.params.id));
    if (!ashram) {
      return res.status(404).json({ message: 'Ashram not found' });
    }
    res.json(ashram);
  } catch (error) {
    console.error('Error fetching ashram:', error);
    res.status(500).json({ message: 'Failed to fetch ashram' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

app.get('/api/meetups', async (req, res) => {
  try {
    const meetups = await storage.getMeetups();
    res.json(meetups);
  } catch (error) {
    console.error('Error fetching meetups:', error);
    res.status(500).json({ message: 'Failed to fetch meetups' });
  }
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await storage.getAuthUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const verificationToken = generateToken();
    
    const user = await storage.createAuthUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      emailVerified: false,
      verificationToken
    });

    // Send verification email
    await sendVerificationEmail(email, firstName, verificationToken);

    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      userId: user.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await storage.getAuthUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    const token = generateToken();
    
    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await storage.getAuthUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = generateToken();
    await storage.updateAuthUser(user.id, { resetToken });
    
    await sendPasswordResetEmail(email, user.firstName, resetToken);
    
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const user = await storage.getAuthUser(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if already subscribed
    const existing = await storage.getNewsletterSubscriberByEmail(email);
    if (existing && existing.verified) {
      return res.status(400).json({ message: 'Email is already subscribed to our newsletter' });
    }

    const verificationToken = generateToken();
    
    if (existing) {
      // Update existing subscriber
      await storage.updateNewsletterSubscriber(existing.id, { verificationToken });
    } else {
      // Create new subscriber
      await storage.createNewsletterSubscriber(email, verificationToken);
    }

    await sendVerificationEmail(email, 'Friend', verificationToken, true);
    
    res.json({ message: 'Please check your email to confirm your subscription.' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Subscription failed' });
  }
});

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    await storage.createContactMessage({
      name,
      email, 
      subject,
      message
    });
    
    res.json({ message: 'Thank you for your message. We will get back to you soon!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await chatWithOpenAI(message);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Chat service unavailable' });
  }
});

// Export for Netlify Functions
export const handler = serverless(app);