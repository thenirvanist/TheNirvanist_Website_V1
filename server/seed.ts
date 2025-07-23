import { db } from "./db";
import { journeys, sages, ashrams } from "@shared/schema";

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

    // Insert data
    await db.insert(journeys).values(journeyData);
    await db.insert(sages).values(sageData);
    await db.insert(ashrams).values(ashramData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export { seedDatabase };