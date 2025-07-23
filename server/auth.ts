import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import type { AuthUser, LoginData, RegisterData } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_EXPIRES_IN = "7d";

// Email configuration
const createEmailTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Fallback to console logging for development
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
};

export const authService = {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  },

  // Compare password
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },

  // Generate JWT token
  generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  // Verify JWT token
  verifyToken(token: string): { userId: number } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      return null;
    }
  },

  // Generate verification token
  generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  },

  // Register user
  async register(userData: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // Check if user already exists
    const existingUser = await storage.getAuthUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);
    
    // Generate email verification token
    const emailVerificationToken = this.generateVerificationToken();

    // Create user
    const user = await storage.createAuthUser({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailVerificationToken,
      emailVerified: false,
    });

    // Send verification email
    await this.sendVerificationEmail(user.email, emailVerificationToken);

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { user, token };
  },

  // Login user
  async login(loginData: LoginData): Promise<{ user: AuthUser; token: string }> {
    // Find user by email
    const user = await storage.getAuthUserByEmail(loginData.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { user, token };
  },

  // Verify email
  async verifyEmail(token: string): Promise<boolean> {
    const user = await storage.getAuthUserByVerificationToken(token);
    if (!user) {
      throw new Error("Invalid verification token");
    }

    await storage.updateAuthUser(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
    });

    return true;
  },

  // Send verification email
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const transporter = createEmailTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@nirvanist.com',
      to: email,
      subject: 'Verify Your Email - The Nirvanist',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #70c92e, #4f8638); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to The Nirvanist</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your spiritual journey begins here</p>
          </div>
          
          <div style="padding: 40px 30px; background: white;">
            <h2 style="color: #253e1a; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Thank you for joining The Nirvanist community! Please click the button below to verify your email address and complete your registration.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" style="background: #70c92e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If you didn't create an account with The Nirvanist, you can safely ignore this email.
            </p>
            
            <p style="color: #999; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #70c92e;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="background: #f7f2e8; padding: 20px 30px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              © 2025 The Nirvanist. Connecting souls with sacred journeys.
            </p>
          </div>
        </div>
      `,
    };

    if (process.env.NODE_ENV === 'development' && !process.env.SENDGRID_API_KEY) {
      console.log('📧 Verification email (development mode):');
      console.log(`To: ${email}`);
      console.log(`Verification URL: ${verificationUrl}`);
    } else {
      await transporter.sendMail(mailOptions);
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const user = await storage.getAuthUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return true;
    }

    const resetToken = this.generateVerificationToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await storage.updateAuthUser(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    const transporter = createEmailTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@nirvanist.com',
      to: email,
      subject: 'Reset Your Password - The Nirvanist',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #70c92e, #4f8638); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">The Nirvanist</p>
          </div>
          
          <div style="padding: 40px 30px; background: white;">
            <h2 style="color: #253e1a; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background: #70c92e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
            
            <p style="color: #999; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #70c92e;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="background: #f7f2e8; padding: 20px 30px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              © 2025 The Nirvanist. Connecting souls with sacred journeys.
            </p>
          </div>
        </div>
      `,
    };

    if (process.env.NODE_ENV === 'development' && !process.env.SENDGRID_API_KEY) {
      console.log('📧 Password reset email (development mode):');
      console.log(`To: ${email}`);
      console.log(`Reset URL: ${resetUrl}`);
    } else {
      await transporter.sendMail(mailOptions);
    }

    return true;
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await storage.getAuthUserByResetToken(token);
    if (!user || !user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await storage.updateAuthUser(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return true;
  },

  // Send newsletter verification email
  async sendNewsletterVerificationEmail(email: string, token: string): Promise<void> {
    const transporter = createEmailTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/verify-newsletter?token=${token}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@nirvanist.com',
      to: email,
      subject: 'Confirm Your Newsletter Subscription - The Nirvanist',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #70c92e, #4f8638); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Newsletter</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">The Nirvanist - Spiritual Insights</p>
          </div>
          
          <div style="padding: 40px 30px; background: white;">
            <h2 style="color: #253e1a; margin-bottom: 20px;">Confirm Your Subscription</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Thank you for subscribing to The Nirvanist newsletter! Please click the button below to confirm your subscription and start receiving spiritual insights, journey updates, and exclusive content.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" style="background: #70c92e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Confirm Subscription
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If you didn't subscribe to our newsletter, you can safely ignore this email.
            </p>
            
            <p style="color: #999; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #70c92e;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="background: #f7f2e8; padding: 20px 30px; text-align: center;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              © 2025 The Nirvanist. Connecting souls with sacred journeys.
            </p>
          </div>
        </div>
      `,
    };

    if (process.env.NODE_ENV === 'development' && !process.env.SENDGRID_API_KEY) {
      console.log('📧 Newsletter verification email (development mode):');
      console.log(`To: ${email}`);
      console.log(`Verification URL: ${verificationUrl}`);
    } else {
      await transporter.sendMail(mailOptions);
    }
  },
};

// Middleware for authentication
export const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  try {
    const user = await storage.getAuthUser(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error' });
  }
};