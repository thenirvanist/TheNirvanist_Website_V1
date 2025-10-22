// Netlify Functions entry point
const express = require('express');
const serverless = require('serverless-http');
// Simple in-memory storage for Netlify (since we can't import the full storage)
const storage = {
  journeys: [
    {
      id: 1,
      title: "Mindful Himalayas Retreat",
      description: "7-day transformative journey through sacred Himalayan monasteries and meditation centers",
      location: "Himalayas, Nepal",
      duration: "7 days",
      price: "$399 + expenses",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      inclusions: ["Accommodation", "Meditation sessions", "Local guide", "Traditional meals"],
      itinerary: "Day 1: Arrival and orientation...",
      available: true,
      overview: "Experience profound peace in sacred Himalayan spaces",
      fullDescription: "Journey into the heart of spiritual transformation...",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
    },
    {
      id: 2,
      title: "Balinese Serenity Journey",
      description: "5-day immersion in traditional Balinese spiritual practices and temple ceremonies",
      location: "Ubud, Bali",
      duration: "5 days",
      price: "$299 + expenses",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      inclusions: ["Temple visits", "Traditional ceremonies", "Yoga sessions", "Cultural experiences"],
      itinerary: "Day 1: Temple blessing ceremony...",
      available: true,
      overview: "Discover Balinese spiritual wisdom and healing traditions",
      fullDescription: "Immerse yourself in the rich spiritual culture of Bali...",
      heroImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
    }
  ],
  sages: [
    {
      id: 1,
      name: "Ramana Maharshi",
      description: "Self-realized sage who taught through silence and self-inquiry",
      biography: "Born in 1879, Ramana Maharshi was one of the most revered spiritual teachers of modern India...",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
      teachings: ["Self-inquiry", "Who am I?", "Silence as teaching"],
      books: ["Who Am I?", "Forty Verses on Reality"],
      location: "Tiruvannamalai, India",
      category: "Hindu",
      era: "Modern",
      status: "Historical"
    }
  ],
  ashrams: [
    {
      id: 1,
      name: "Rishikesh Sacred Valley",
      location: "Rishikesh, Uttarakhand",
      description: "Peaceful ashram nestled in the sacred Ganges valley",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      facilities: ["Meditation halls", "Yoga studios", "Sacred river access"],
      programs: ["Daily meditation", "Yoga classes", "Spiritual discourses"],
      contact: "info@rishikeshvalley.org",
      region: "North India",
      focus: "Meditation & Yoga",
      founders: "Sri Swami Sivananda"
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Sarah Chen",
      location: "San Francisco, USA",
      text: "The Himalayan retreat completely transformed my perspective on life and spirituality.",
      rating: 5,
      journeyId: 1,
      image: "https://images.unsplash.com/photo-1494790108755-2616c163e820?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    }
  ],
  meetups: [
    {
      id: 1,
      title: "Global Meditation Circle",
      description: "Weekly online meditation sessions with spiritual seekers worldwide",
      date: "Every Sunday",
      time: "7:00 PM EST",
      type: "Virtual",
      image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      participants: 150,
      host: "The Nirvanist Community"
    }
  ],
  
  // Simple methods
  getJourneys: () => Promise.resolve(storage.journeys),
  getJourney: (id) => Promise.resolve(storage.journeys.find(j => j.id === id)),
  getSages: () => Promise.resolve(storage.sages),
  getSage: (id) => Promise.resolve(storage.sages.find(s => s.id === id)),
  getAshrams: () => Promise.resolve(storage.ashrams),
  getAshram: (id) => Promise.resolve(storage.ashrams.find(a => a.id === id)),
  getTestimonials: () => Promise.resolve(storage.testimonials),
  getMeetups: () => Promise.resolve(storage.meetups),
  
  // Auth methods (simplified)
  getAuthUserByEmail: () => Promise.resolve(null),
  createAuthUser: () => Promise.resolve({ id: 1 }),
  updateAuthUser: () => Promise.resolve({ id: 1 }),
  createContactMessage: () => Promise.resolve({ id: 1 }),
  createNewsletterSubscriber: () => Promise.resolve({ id: 1 }),
  getNewsletterSubscriberByEmail: () => Promise.resolve(null),
  updateNewsletterSubscriber: () => Promise.resolve({ id: 1 })
};

// Simple auth functions
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  req.userId = 1; // Simplified
  next();
};

const hashPassword = (password) => Promise.resolve('hashed_' + password);
const verifyPassword = (password, hash) => Promise.resolve(hash === 'hashed_' + password);
const generateToken = () => Math.random().toString(36).substr(2, 9);

// Simple email functions
const sendVerificationEmail = () => Promise.resolve();
const sendPasswordResetEmail = () => Promise.resolve();

// Simple OpenAI function
const chatWithOpenAI = (message) => Promise.resolve('Thank you for your spiritual inquiry. I am here to help guide you on your journey.');

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
module.exports.handler = serverless(app);