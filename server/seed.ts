import { db } from "./db";
import { journeys, sages, ashrams, blogPosts } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Seed journeys
    const journeyData = [
      {
        title: "Mindful Himalayas Retreat",
        description: "7-day transformative journey through sacred Himalayan monasteries and meditation centers",
        location: "Himalayas, Nepal",
        duration: "7 days",
        price: "$399 + expenses",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Accommodation", "Meditation sessions", "Local guide", "Traditional meals"],
        itinerary: "Day 1: Arrival and orientation...",
        available: true
      },
      {
        title: "Balinese Serenity Journey",
        description: "5-day immersion in traditional Balinese spiritual practices and temple ceremonies",
        location: "Ubud, Bali",
        duration: "5 days",
        price: "$299 + expenses",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Temple visits", "Traditional ceremonies", "Yoga sessions", "Cultural experiences"],
        itinerary: "Day 1: Temple blessing ceremony...",
        available: true
      },
      {
        title: "Sacred India Pilgrimage",
        description: "10-day spiritual odyssey visiting ancient ashrams and holy sites across India",
        location: "Rishikesh, India",
        duration: "10 days",
        price: "$399 + expenses",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Ashram stays", "Spiritual teachings", "Sacred site visits", "Meditation practice"],
        itinerary: "Day 1: Arrival in Rishikesh...",
        available: true
      },
      {
        title: "Tibetan Wisdom Quest",
        description: "6-day immersion in Tibetan Buddhist teachings and mountain meditation",
        location: "Dharamshala, India",  
        duration: "6 days",
        price: "$349 + expenses",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Monastery visits", "Buddhist teachings", "Mountain treks", "Meditation practices"],
        itinerary: "Day 1: Arrival in Dharamshala...",
        available: true
      },
      {
        title: "Japanese Zen Experience",
        description: "8-day journey through traditional Japanese temples and zen gardens",
        location: "Kyoto, Japan",
        duration: "8 days", 
        price: "$599 + expenses",
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Temple stays", "Zen meditation", "Tea ceremonies", "Garden contemplation"],
        itinerary: "Day 1: Arrival in Kyoto...",
        available: true
      },
      {
        title: "Peruvian Shamanic Journey",
        description: "9-day spiritual awakening in the sacred sites of Peru",
        location: "Cusco & Machu Picchu, Peru",
        duration: "9 days",
        price: "$699 + expenses", 
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        inclusions: ["Shamanic ceremonies", "Sacred site visits", "Ayahuasca preparation", "Mountain meditation"],
        itinerary: "Day 1: Arrival in Cusco...",
        available: true
      }
    ];

    // Seed sages
    const sageData = [
      {
        name: "Ramana Maharshi",
        description: "Self-realization and the path of self-inquiry",
        biography: "Sri Ramana Maharshi was one of the most revered spiritual masters of modern times...",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        teachings: ["Self-inquiry", "Who am I?", "Presence", "Silence"],
        books: ["I Am That I Am", "Talks with Ramana Maharshi", "Who Am I?"]
      },
      {
        name: "Amma (Mata Amritanandamayi)",
        description: "The hugging saint spreading love and compassion worldwide",  
        biography: "Known as the 'Hugging Saint', Amma has embraced over 40 million people...",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        teachings: ["Unconditional love", "Service", "Compassion", "Selflessness"],
        books: ["Awaken Children", "For My Children", "From Amma's Heart"]
      },
      {
        name: "Sadhguru",
        description: "Contemporary mystic and founder of Isha Foundation",
        biography: "Sadhguru is a contemporary guru and founder of the Isha Foundation...",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        teachings: ["Inner engineering", "Consciousness", "Yoga", "Transformation"],
        books: ["Inner Engineering", "Mystic's Musings", "Death: An Inside Story"]
      },
      {
        name: "Thich Nhat Hanh",
        description: "Vietnamese Zen master and mindfulness teacher",
        biography: "Thich Nhat Hanh was a globally renowned Zen master, poet, and peace activist...",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        teachings: ["Mindfulness", "Interbeing", "Peaceful living", "Present moment awareness"],
        books: ["The Miracle of Mindfulness", "Peace Is Every Step", "Being Peace"]
      },  
      {
        name: "Sri Aurobindo",
        description: "Indian philosopher and guru of integral yoga",
        biography: "Sri Aurobindo was an Indian philosopher, yogi, and poet who developed integral yoga...",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        teachings: ["Integral yoga", "Divine evolution", "Spiritual transformation", "Supermind"],
        books: ["The Life Divine", "Synthesis of Yoga", "Savitri"]
      }
    ];

    // Seed ashrams
    const ashramData = [
      {
        name: "Rishikesh Sacred Valley",
        location: "Rishikesh, India",
        description: "Ancient ashram nestled in the Himalayan foothills, perfect for meditation and spiritual study",
        facilities: ["Meditation halls", "Yoga studios", "Vegetarian meals", "Library", "River access"],
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "+91-135-244-1234",
        website: "https://rishikeshvalley.org"
      },
      {
        name: "Tiruvannamalai Sanctuary",
        location: "Tamil Nadu, India",
        description: "Sacred mountain retreat center at the base of Arunachala, ideal for self-inquiry practice",
        facilities: ["Silent meditation", "Ramana teachings", "Simple accommodation", "Sacred mountain access"],
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "+91-4175-227-112",
        website: "https://arunachala-ashram.org"
      },
      {
        name: "Amritapuri Divine Center",
        location: "Kerala, India",
        description: "Amma's main ashram offering service, meditation, and the chance to receive her divine embrace",
        facilities: ["Darshan hall", "Service activities", "Meditation spaces", "Guest rooms", "Beach access"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "+91-476-289-6399",
        website: "https://amritapuri.org"
      },
      {
        name: "Osho International Commune",
        location: "Pune, India", 
        description: "Dynamic meditation center focusing on modern spiritual practices and consciousness expansion",
        facilities: ["Dynamic meditation", "Therapy groups", "Celebration halls", "Zen gardens"],
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "+91-20-6601-9999",
        website: "https://osho.com"
      },
      {
        name: "Sivananda Kutir",
        location: "Uttarakhand, India",
        description: "Traditional ashram dedicated to classical yoga teachings and spiritual discipline",
        facilities: ["Hatha yoga", "Pranayama classes", "Vedanta study", "Spiritual library"],
        image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "+91-135-243-0040",
        website: "https://sivanandaonline.org"
      }
    ];

    // Seed blog posts
    const blogPostData = [
      {
        title: "The Art of Mindful Eating: Nourishing Your Body and Soul",
        content: `<h2>Introduction to Mindful Eating</h2><p>In our fast-paced world, eating has become a rushed activity, often done while multitasking or scrolling through our phones. But what if we could transform this daily necessity into a sacred practice of inner nutrition?</p><h2>The Spiritual Dimension of Food</h2><p>Food is not merely fuel for the body—it is life force, prana, chi. When we eat mindfully, we honor the earth that grew our food, the hands that prepared it, and the body that will transform it into energy.</p><h2>Practical Steps to Mindful Eating</h2><ul><li><strong>Create Sacred Space:</strong> Set your dining area as a sanctuary, free from distractions</li><li><strong>Express Gratitude:</strong> Take a moment to appreciate the journey of your food</li><li><strong>Engage Your Senses:</strong> Notice colors, textures, aromas, and flavors</li><li><strong>Chew Slowly:</strong> Allow proper digestion and full appreciation</li><li><strong>Listen to Your Body:</strong> Honor hunger and satiety signals</li></ul><blockquote>"When we eat with full awareness, every bite becomes a moment of meditation, every meal a celebration of life itself."</blockquote>`,
        excerpt: "Discover how transforming your relationship with food can become a powerful spiritual practice that nourishes both body and soul through mindful awareness.",
        author: "Dr. Sarah Chen",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bannerImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        slug: "mindful-eating-nourishing-body-and-soul",
        readTime: "8 min read",
        tags: ["mindful eating", "spiritual nutrition", "meditation", "awareness"],
        published: true,
        featured: true
      },
      {
        title: "Sacred Breath: The Gateway to Inner Peace",
        content: `<h2>The Power of Conscious Breathing</h2><p>Breath is the bridge between body and soul, the rhythm that connects us to life itself. In every spiritual tradition, breath is recognized as the pathway to deeper states of consciousness and inner peace.</p><h2>Ancient Wisdom, Modern Science</h2><p>What ancient yogis knew thousands of years ago, modern neuroscience now confirms: conscious breathing directly influences our nervous system, reducing stress hormones and activating our body's natural relaxation response.</p><blockquote>"The breath is the thread that weaves together all aspects of our being—physical, mental, emotional, and spiritual."</blockquote>`,
        excerpt: "Explore the transformative power of conscious breathing and learn how this simple practice can become your gateway to inner peace and spiritual awakening.",
        author: "Ravi Patel",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bannerImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        slug: "sacred-breath-gateway-inner-peace",
        readTime: "6 min read",
        tags: ["breathing", "pranayama", "meditation", "peace"],
        published: true,
        featured: false
      },
      {
        title: "The Wisdom of Silence: Finding Your Inner Voice",
        content: `<h2>In a World of Noise</h2><p>We live in an age of constant stimulation—notifications, conversations, media, and the endless chatter of our own minds. In this cacophony, we've forgotten the profound wisdom that emerges in silence.</p><h2>Silence as Sacred Space</h2><p>True silence is not merely the absence of sound, but the presence of awareness. It's in these quiet moments that we reconnect with our authentic self, beyond the roles we play and the masks we wear.</p><blockquote>"In the silence of the heart, God speaks. In the quiet of the soul, wisdom emerges."</blockquote>`,
        excerpt: "Discover the transformative power of silence and learn how to access your inner wisdom through the practice of stillness and presence.",
        author: "Maria Santos",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bannerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        slug: "wisdom-of-silence-finding-inner-voice",
        readTime: "7 min read", 
        tags: ["silence", "meditation", "inner wisdom", "presence"],
        published: true,
        featured: true
      },
      {
        title: "Gratitude as Spiritual Practice: Transforming Daily Life",
        content: `<h2>The Alchemy of Appreciation</h2><p>Gratitude is more than a positive emotion—it's a powerful spiritual practice that has the ability to transform our perception of reality and our experience of life itself.</p><h2>Beyond Thank You</h2><p>While saying "thank you" is polite, true gratitude goes much deeper. It's a recognition of the interconnected web of life that supports our existence.</p><blockquote>"Gratitude is not only the greatest of virtues but the parent of all others." - Cicero</blockquote>`,
        excerpt: "Learn how to transform gratitude from a simple courtesy into a profound spiritual practice that can reshape your entire experience of life.",
        author: "Dr. Michael Thompson",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bannerImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        slug: "gratitude-spiritual-practice-transforming-daily-life",
        readTime: "6 min read",
        tags: ["gratitude", "appreciation", "spiritual practice", "transformation"],
        published: true,
        featured: false
      },
      {
        title: "Inner Healing: The Journey from Wound to Wisdom",
        content: `<h2>Embracing Our Shadows</h2><p>The path to wholeness requires us to acknowledge not just our light, but also our shadows—the wounded, hurt, and tender parts of ourselves that we often try to hide or ignore.</p><h2>Wounds as Gateways</h2><p>Our deepest wounds often become our greatest sources of wisdom and compassion. The very experiences that break us open can ultimately become the foundation for our most profound growth.</p><blockquote>"The wound is the place where the Light enters you." - Rumi</blockquote>`,
        excerpt: "Explore how our deepest wounds can become our greatest sources of wisdom and learn practical approaches to transforming pain into purpose.",
        author: "Dr. Elena Rodriguez",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bannerImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        slug: "inner-healing-journey-wound-to-wisdom",
        readTime: "9 min read",
        tags: ["healing", "inner work", "transformation", "wholeness"],
        published: true,
        featured: true
      }
    ];

    // Insert data
    await db.insert(journeys).values(journeyData);
    await db.insert(sages).values(sageData);
    await db.insert(ashrams).values(ashramData);
    await db.insert(blogPosts).values(blogPostData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export { seedDatabase };