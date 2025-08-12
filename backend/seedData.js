const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Import models
const User = require('./models/User');
const Article = require('./models/Article');

const sampleUsers = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: 'password123'
  },
  {
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@example.com',
    password: 'password123'
  },
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    password: 'password123'
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    password: 'password123'
  },
  {
    name: 'Lisa Park',
    email: 'lisa.park@example.com',
    password: 'password123'
  }
];

const sampleStories = [
  {
    title: "The Future of Artificial Intelligence: What to Expect in 2024",
    body: `Artificial Intelligence has been evolving at an unprecedented pace, and 2024 promises to be a landmark year for the technology. From breakthroughs in natural language processing to advancements in computer vision, AI is reshaping industries across the globe.

One of the most exciting developments is the emergence of more sophisticated language models that can understand context and generate human-like responses. These models are not just improving chatbots and virtual assistants; they're revolutionizing how we interact with technology.

In healthcare, AI is making significant strides in early disease detection and personalized treatment plans. Machine learning algorithms can now analyze medical images with accuracy that rivals human experts, leading to earlier diagnoses and better patient outcomes.

The automotive industry is also experiencing an AI revolution, with self-driving technology becoming more reliable and widespread. Companies like Tesla, Waymo, and others are pushing the boundaries of what's possible in autonomous transportation.

However, with these advancements come important questions about ethics, privacy, and the future of work. As AI systems become more capable, we need to ensure they're developed and deployed responsibly.

The key to successful AI implementation lies in finding the right balance between innovation and regulation. We must embrace the benefits while addressing the challenges head-on.

Looking ahead, we can expect AI to become even more integrated into our daily lives, from smart homes to personalized education systems. The technology that once seemed like science fiction is now becoming reality, and it's up to us to shape its future.`,
    tags: ['artificial intelligence', 'technology', 'future', 'machine learning'],
    authorEmail: 'sarah.chen@example.com'
  },
  {
    title: "Sustainable Living: Small Changes That Make a Big Impact",
    body: `Climate change is one of the most pressing issues of our time, and while the problem may seem overwhelming, there are countless small changes we can make in our daily lives that collectively have a significant impact.

Start with your home. Simple switches like using LED light bulbs, installing a programmable thermostat, and properly insulating your home can reduce your carbon footprint while saving money on energy bills. Consider switching to renewable energy sources if available in your area.

Your diet choices also matter. Reducing meat consumption, even by one meal per week, can significantly lower your environmental impact. The meat industry is one of the largest contributors to greenhouse gas emissions, so every plant-based meal helps.

Transportation is another area where small changes add up. Walking, biking, or using public transportation instead of driving can dramatically reduce your carbon emissions. If you must drive, consider carpooling or investing in an electric or hybrid vehicle.

When it comes to shopping, choose quality over quantity. Fast fashion contributes to massive amounts of waste and pollution. Instead, invest in timeless pieces that last longer and support sustainable brands when possible.

Reduce, reuse, recycle should be your mantra. Start by reducing your consumption of single-use plastics. Bring your own water bottle, coffee cup, and shopping bags. When you do need to buy something, look for products with minimal packaging.

Remember, sustainability isn't about perfection—it's about progress. Every small change you make contributes to a larger movement toward a more sustainable future. The key is to start where you are and keep moving forward.`,
    tags: ['sustainability', 'environment', 'climate change', 'lifestyle'],
    authorEmail: 'marcus.rodriguez@example.com'
  },
  {
    title: "The Art of Mindful Productivity: Working Smarter, Not Harder",
    body: `In our fast-paced world, productivity has become synonymous with busyness. We measure success by how many hours we work, how many tasks we complete, and how little sleep we get. But what if there's a better way?

Mindful productivity is about working with intention and awareness, rather than just working harder. It's about understanding your energy levels, focusing on what truly matters, and creating sustainable work habits that don't lead to burnout.

Start by identifying your peak productivity hours. Most people have specific times of day when they're most focused and creative. Schedule your most important tasks during these windows and save routine work for your lower-energy periods.

The Pomodoro Technique is a powerful tool for maintaining focus. Work for 25 minutes, then take a 5-minute break. This approach helps prevent mental fatigue and keeps your mind fresh throughout the day.

Learn to say no. Not every opportunity is worth pursuing, and not every request deserves your time. Be selective about what you commit to, and don't be afraid to delegate tasks that others can handle.

Create a distraction-free environment. Turn off notifications, close unnecessary browser tabs, and find a quiet space to work. Your brain can't focus on multiple things at once, so give it the space it needs to do its best work.

Remember to take breaks. Regular breaks actually improve productivity by preventing mental fatigue and maintaining creativity. Use your breaks to move your body, practice deep breathing, or simply step away from your work.

Finally, measure your success by the quality of your work, not just the quantity. It's better to complete three meaningful tasks than to rush through ten unimportant ones.

Mindful productivity isn't about doing more—it's about doing what matters most, with intention and care.`,
    tags: ['productivity', 'mindfulness', 'work-life balance', 'personal development'],
    authorEmail: 'emma.thompson@example.com'
  },
  {
    title: "The Psychology of Habit Formation: Building Lasting Change",
    body: `We are creatures of habit. Nearly half of our daily actions are performed automatically, without conscious thought. Understanding how habits work is the key to creating lasting positive change in our lives.

Habits follow a simple loop: cue, craving, response, and reward. The cue triggers your brain to go into automatic mode, the craving provides the motivation, the response is the actual habit, and the reward satisfies the craving.

To build a new habit, start by making the cue obvious. If you want to start reading more, place a book on your bedside table. If you want to exercise in the morning, lay out your workout clothes the night before.

Make the habit attractive by linking it to something you already enjoy. Listen to your favorite podcast while exercising, or reward yourself with a special treat after completing a difficult task.

Make the habit easy by reducing friction. Want to drink more water? Keep a water bottle on your desk. Want to meditate? Start with just one minute per day.

Finally, make the habit satisfying. The reward should be immediate and enjoyable. This could be crossing something off your to-do list, treating yourself to something small, or simply acknowledging your progress.

Breaking bad habits follows the same principles in reverse. Make the cue invisible, make the habit unattractive, make it difficult, and make it unsatisfying.

Remember, habits compound over time. Small changes may seem insignificant at first, but they add up to remarkable results. A 1% improvement every day leads to a 37% improvement over a year.

The key is consistency, not perfection. Miss a day? Don't worry about it. Just get back on track the next day. The goal is to build systems that make good habits inevitable and bad habits impossible.`,
    tags: ['habits', 'psychology', 'personal development', 'behavior change'],
    authorEmail: 'david.kim@example.com'
  },
  {
    title: "Digital Nomad Life: Working from Anywhere in the World",
    body: `The traditional 9-to-5 office job is no longer the only path to professional success. Thanks to technology and changing workplace attitudes, more people than ever are embracing the digital nomad lifestyle—working remotely while traveling the world.

The appeal is obvious: freedom to work from anywhere, exposure to new cultures, and the ability to design your own schedule. But the reality is more complex than the Instagram photos suggest.

Successful digital nomads understand that this lifestyle requires careful planning and discipline. You need reliable internet, a comfortable workspace, and the ability to maintain productivity while dealing with the challenges of travel.

Choose your destinations wisely. Consider factors like cost of living, internet speed, time zones (relative to your clients or team), and visa requirements. Some countries offer special visas for digital nomads, making it easier to stay longer.

Create a routine that works for you. While flexibility is one of the benefits of this lifestyle, having some structure helps maintain productivity. Set regular work hours, even if they vary by location.

Invest in the right tools and equipment. A good laptop, noise-canceling headphones, and a portable monitor can make all the difference in your productivity and comfort.

Build a community. Digital nomad life can be lonely, so seek out co-working spaces, meetups, and online communities. Connecting with other nomads provides support, networking opportunities, and friendship.

Plan for the long term. Consider healthcare, taxes, and retirement planning. Many nomads eventually choose to establish a home base or return to a more traditional lifestyle.

The digital nomad lifestyle isn't for everyone, but for those who embrace it, it offers unparalleled freedom and adventure. The key is finding the right balance between work and exploration.`,
    tags: ['digital nomad', 'remote work', 'travel', 'lifestyle'],
    authorEmail: 'lisa.park@example.com'
  },
  {
    title: "The Science of Sleep: Why Quality Rest is Essential for Success",
    body: `Sleep is often the first thing we sacrifice when life gets busy. We stay up late working, wake up early to exercise, and convince ourselves that we can function on minimal rest. But the science is clear: quality sleep is non-negotiable for health, productivity, and success.

During sleep, your brain processes information, consolidates memories, and removes toxins that accumulate during the day. Without adequate sleep, your cognitive function, emotional regulation, and physical health all suffer.

The average adult needs 7-9 hours of sleep per night, but quality matters as much as quantity. Deep sleep and REM sleep are particularly important for memory consolidation and emotional processing.

Create a sleep-friendly environment. Keep your bedroom cool, dark, and quiet. Invest in a comfortable mattress and pillows. Consider using blackout curtains and a white noise machine if needed.

Establish a consistent sleep schedule. Go to bed and wake up at the same time every day, even on weekends. This helps regulate your circadian rhythm and improves sleep quality.

Develop a relaxing bedtime routine. Avoid screens for at least an hour before bed, as blue light can interfere with melatonin production. Instead, read a book, take a warm bath, or practice gentle stretching.

Be mindful of what you consume. Avoid caffeine after 2 PM, limit alcohol (which can disrupt sleep), and avoid large meals close to bedtime.

Exercise regularly, but not too close to bedtime. Physical activity helps you fall asleep faster and sleep more deeply, but exercising too close to bedtime can have the opposite effect.

If you're struggling with sleep, consider keeping a sleep diary to identify patterns and triggers. And don't hesitate to seek professional help if sleep problems persist.

Remember, sleep is not a luxury—it's a biological necessity. Prioritizing sleep is one of the best investments you can make in your health and success.`,
    tags: ['sleep', 'health', 'wellness', 'productivity'],
    authorEmail: 'sarah.chen@example.com'
  },
  {
    title: "The Rise of Plant-Based Diets: Health, Environment, and Ethics",
    body: `Plant-based diets are gaining popularity worldwide, driven by concerns about health, environmental sustainability, and animal welfare. But what does the science say about these dietary choices?

From a health perspective, well-planned plant-based diets can provide all the nutrients your body needs while offering numerous health benefits. Research shows that plant-based eaters tend to have lower rates of heart disease, certain cancers, and type 2 diabetes.

However, it's important to plan carefully to ensure adequate intake of key nutrients like protein, iron, calcium, vitamin B12, and omega-3 fatty acids. Many plant-based foods are rich in these nutrients, but some may require supplementation.

The environmental impact of dietary choices is significant. Animal agriculture is a major contributor to greenhouse gas emissions, deforestation, and water pollution. Shifting toward plant-based diets can significantly reduce your environmental footprint.

But plant-based doesn't have to mean all-or-nothing. Many people choose to reduce their meat consumption rather than eliminate it entirely. This approach, sometimes called "flexitarian," can still provide significant health and environmental benefits.

The key is to focus on whole, minimally processed foods. A diet rich in fruits, vegetables, whole grains, legumes, nuts, and seeds provides the foundation for good health, regardless of whether you include animal products.

If you're considering a plant-based diet, start gradually. Try meatless Mondays, experiment with new recipes, and gradually increase the proportion of plant-based foods in your diet.

Remember, the goal is to find a dietary pattern that works for you and aligns with your values. Whether you choose to go fully plant-based or simply reduce your meat consumption, every step toward more sustainable eating habits makes a difference.`,
    tags: ['nutrition', 'plant-based', 'health', 'environment'],
    authorEmail: 'marcus.rodriguez@example.com'
  },
  {
    title: "The Future of Remote Work: Lessons from the Pandemic",
    body: `The COVID-19 pandemic forced a massive experiment in remote work, and the results have been transformative. What started as a temporary necessity has become a permanent shift in how we think about work and productivity.

Companies discovered that many jobs can be done effectively from anywhere, leading to increased flexibility and improved work-life balance for employees. But remote work also presented new challenges that organizations are still learning to address.

Communication becomes more intentional in remote environments. Without the casual conversations that happen in office hallways, teams need to create opportunities for connection and collaboration. Regular video calls, virtual coffee chats, and team-building activities help maintain relationships.

Technology plays a crucial role in remote work success. Reliable video conferencing, project management tools, and cloud-based collaboration platforms are essential. But it's also important to establish boundaries around technology use to prevent burnout.

Remote work has also highlighted the importance of trust and autonomy. Managers who focus on outcomes rather than hours worked tend to have more successful remote teams. This shift toward results-based management is likely to continue.

The hybrid model—combining remote and in-office work—is emerging as a popular solution. This approach offers the flexibility of remote work while maintaining the benefits of in-person collaboration.

As we move forward, the key is to learn from the pandemic experience and build work environments that prioritize both productivity and well-being. The future of work is flexible, and organizations that adapt will be best positioned for success.`,
    tags: ['remote work', 'workplace', 'pandemic', 'future of work'],
    authorEmail: 'emma.thompson@example.com'
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Article.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create articles
    for (const storyData of sampleStories) {
      const author = createdUsers.find(user => user.email === storyData.authorEmail);
      if (author) {
        await Article.create({
          title: storyData.title,
          body: storyData.body,
          tags: storyData.tags,
          author: author._id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        });
        console.log(`Created article: ${storyData.title}`);
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
