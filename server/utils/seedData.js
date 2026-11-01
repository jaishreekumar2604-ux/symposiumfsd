require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/symposium_portal';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`\x1b[32m%s\x1b[0m`, `✓ Connected to MongoDB for seeding: ${uri}`);
  } catch (err) {
    console.error(`\x1b[31m%s\x1b[0m`, `✗ Seeding DB connection error: ${err.message}`);
    console.log(`\x1b[33m%s\x1b[0m`, `  Please make sure MongoDB / MongoDB Compass is running locally.`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    console.log('Clearing existing data...');
    try {
      await mongoose.connection.collection('registrations').dropIndexes();
    } catch (e) {}
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();

    console.log('Creating users...');
    const adminUser = await User.create({
      name: 'Jaishree K',
      email: 'jaishree@sympora.edu',
      password: 'Admin@123',
      role: 'admin',
      department: 'Computer Science & Engineering',
      college: 'College of Engineering & Technology',
      rollNumber: '26CSE001',
      phone: '+91 98765 43210',
    });

    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@student.edu',
      password: 'User@123',
      role: 'student',
      department: 'Computer Science & Engineering',
      college: 'College of Engineering & Technology',
      rollNumber: '26CSE045',
      phone: '+91 98111 22334',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@student.edu',
      password: 'User@123',
      role: 'student',
      department: 'Artificial Intelligence & Data Science',
      college: 'College of Engineering & Technology',
      rollNumber: '26AI018',
      phone: '+91 98222 33445',
    });

    const student3 = await User.create({
      name: 'Aditya Verma',
      email: 'aditya@student.edu',
      password: 'User@123',
      role: 'student',
      department: 'Electronics & Communication',
      college: 'College of Engineering & Technology',
      rollNumber: '26ECE032',
      phone: '+91 98333 44556',
    });

    console.log('Creating events...');
    const eventsData = [
      {
        title: 'INNOVEX 2026: National Technical Symposium',
        clubName: 'ACM & CSI Student Chapter',
        category: 'Symposium',
        department: 'CSE',
        description: 'Flagship annual technical symposium featuring paper presentations, blind coding challenges, algorithm sprint, UI/UX design battle, and tech quizzes with cash prizes over ₹50,000.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        time: '09:00 AM - 05:00 PM',
        venue: 'Kalam Auditorium & CS Lab 3',
        totalSeats: 120,
        availableSeats: 118,
        registeredCount: 2,
        fee: 0,
        tags: ['Symposium', 'Coding', 'Paper Presentation', 'Prizes'],
        bannerGradient: 'from-blue-600 via-indigo-600 to-purple-600',
        organizerContact: {
          name: 'Jaishree K (Faculty Head)',
          email: 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        createdBy: adminUser._id,
      },
      {
        title: 'GenAI & LLM Architecture Masterclass',
        clubName: 'AI & Data Science Society',
        category: 'Workshop',
        department: 'AI & DS',
        description: 'Deep dive into transformer models, fine-tuning Llama-3, Retrieval-Augmented Generation (RAG) pipelines, and deploying production agentic workflows. Hands-on coding in Google Colab & HuggingFace.',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // in 8 days
        time: '10:00 AM - 04:30 PM',
        venue: 'Turing Advanced Computing Center',
        totalSeats: 60,
        availableSeats: 58,
        registeredCount: 2,
        fee: 150,
        tags: ['Generative AI', 'Deep Learning', 'PyTorch', 'RAG'],
        bannerGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
        organizerContact: {
          name: 'Jaishree K (Chief Mentor)',
          email: 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        createdBy: adminUser._id,
      },
      {
        title: 'Autonomous Robotics & ROS2 Hands-on Workshop',
        clubName: 'Robotics & Automation Club',
        category: 'Workshop',
        department: 'ECE',
        description: 'Build LiDAR-navigated rovers, configure Robot Operating System (ROS2) nodes, integrate micro-controllers, and run computer vision SLAM mapping. Hardware kits provided on venue.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: '09:30 AM - 04:00 PM',
        venue: 'Mechatronics Innovation Center, Hall B',
        totalSeats: 40,
        availableSeats: 39,
        registeredCount: 1,
        fee: 200,
        tags: ['Robotics', 'ROS2', 'Embedded Systems', 'IoT'],
        bannerGradient: 'from-amber-500 via-orange-600 to-red-600',
        organizerContact: {
          name: 'Jaishree K',
          email: 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        createdBy: adminUser._id,
      },
      {
        title: 'HackHorizon 2026: 24-Hour Web3 & Cloud Hackathon',
        clubName: 'Open Source Developers Community',
        category: 'Hackathon',
        department: 'IT',
        description: 'A 24-hour sprint to build decentralized applications, zero-trust cloud infrastructure, and fintech microservices. Free food, mentor sessions, swag packs, and direct internship interviews.',
        date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        time: '08:00 AM (24 Hours Overnight)',
        venue: 'Central Incubation & Startup Lounge',
        totalSeats: 80,
        availableSeats: 79,
        registeredCount: 1,
        fee: 0,
        tags: ['Hackathon', 'Web3', 'Cloud Native', 'Overnight'],
        bannerGradient: 'from-fuchsia-600 via-purple-600 to-indigo-700',
        organizerContact: {
          name: 'Jaishree K (Lead Organizer)',
          email: 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        createdBy: adminUser._id,
      },
      {
        title: 'Bio-Informatics & CRISPR Computational Genomics',
        clubName: 'Biotechnology Research Forum',
        category: 'Workshop',
        department: 'Biotechnology',
        description: 'Introduction to molecular modeling tools, PyMOL visualization, protein sequence alignment, and off-target prediction for CRISPR Cas-9 genetic therapies.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        time: '10:00 AM - 03:30 PM',
        venue: 'Bio-Computing Lab 1',
        totalSeats: 35,
        availableSeats: 34,
        registeredCount: 1,
        fee: 100,
        tags: ['Bioinformatics', 'Genomics', 'CRISPR', 'Research'],
        bannerGradient: 'from-rose-500 via-pink-600 to-purple-600',
        organizerContact: {
          name: 'Jaishree K',
          email: 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        createdBy: adminUser._id,
      },
      {
        title: 'Next-Gen EV Powertrain & Battery Tech Summit',
        clubName: 'SAE Collegiate Club',
        category: 'Tech Seminar',
        department: 'Mechanical',
        description: 'Keynote and technical sessions on electric vehicle thermal management, solid-state battery architecture, and CAD simulations led by industry EV architects.',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        time: '01:30 PM - 05:30 PM',
        venue: 'Mechanical Seminar Hall 2',
        totalSeats: 75,
        availableSeats: 75,
        registeredCount: 0,
        fee: 0,
        tags: ['Electric Vehicles', 'Automotive', 'Renewable Energy'],
        bannerGradient: 'from-cyan-600 via-blue-700 to-slate-800',
        organizerContact: {
          name: 'Jaishree K',
          email: 'jaishree@sympora.edu',
          phone: '+91 98765 43210',
        },
        createdBy: adminUser._id,
      },
    ];

    const createdEvents = await Event.insertMany(eventsData);

    console.log('Creating sample registrations...');
    const registrations = [
      {
        registrationId: 'SYM-2026-X9A21',
        ticketId: 'SYM-2026-X9A21',
        user: student1._id,
        event: createdEvents[0]._id,
        attendeeName: student1.name,
        attendeeEmail: student1.email,
        attendeeDepartment: student1.department,
        attendeeRollNo: student1.rollNumber,
        attendeeCollege: student1.college,
        attendeePhone: student1.phone,
        status: 'confirmed',
      },
      {
        registrationId: 'SYM-2026-B4T88',
        ticketId: 'SYM-2026-B4T88',
        user: student2._id,
        event: createdEvents[0]._id,
        attendeeName: student2.name,
        attendeeEmail: student2.email,
        attendeeDepartment: student2.department,
        attendeeRollNo: student2.rollNumber,
        attendeeCollege: student2.college,
        attendeePhone: student2.phone,
        status: 'confirmed',
      },
      {
        registrationId: 'SYM-2026-K7M32',
        ticketId: 'SYM-2026-K7M32',
        user: student2._id,
        event: createdEvents[1]._id,
        attendeeName: student2.name,
        attendeeEmail: student2.email,
        attendeeDepartment: student2.department,
        attendeeRollNo: student2.rollNumber,
        attendeeCollege: student2.college,
        attendeePhone: student2.phone,
        status: 'confirmed',
      },
      {
        registrationId: 'SYM-2026-P2L99',
        ticketId: 'SYM-2026-P2L99',
        user: student1._id,
        event: createdEvents[1]._id,
        attendeeName: student1.name,
        attendeeEmail: student1.email,
        attendeeDepartment: student1.department,
        attendeeRollNo: student1.rollNumber,
        attendeeCollege: student1.college,
        attendeePhone: student1.phone,
        status: 'confirmed',
      },
      {
        registrationId: 'SYM-2026-Q8W14',
        ticketId: 'SYM-2026-Q8W14',
        user: student3._id,
        event: createdEvents[2]._id,
        attendeeName: student3.name,
        attendeeEmail: student3.email,
        attendeeDepartment: student3.department,
        attendeeRollNo: student3.rollNumber,
        attendeeCollege: student3.college,
        attendeePhone: student3.phone,
        status: 'confirmed',
      },
      {
        registrationId: 'SYM-2026-H5R77',
        ticketId: 'SYM-2026-H5R77',
        user: student1._id,
        event: createdEvents[3]._id,
        attendeeName: student1.name,
        attendeeEmail: student1.email,
        attendeeDepartment: student1.department,
        attendeeRollNo: student1.rollNumber,
        attendeeCollege: student1.college,
        attendeePhone: student1.phone,
        status: 'confirmed',
      },
      {
        registrationId: 'SYM-2026-Y3N05',
        ticketId: 'SYM-2026-Y3N05',
        user: student3._id,
        event: createdEvents[4]._id,
        attendeeName: student3.name,
        attendeeEmail: student3.email,
        attendeeDepartment: student3.department,
        attendeeRollNo: student3.rollNumber,
        attendeeCollege: student3.college,
        attendeePhone: student3.phone,
        status: 'confirmed',
      },
    ];

    await Registration.insertMany(registrations);

    console.log(`\x1b[32m%s\x1b[0m`, `✓ Seeding completed successfully!`);
    console.log(`\x1b[36m%s\x1b[0m`, `==========================================================`);
    console.log(`\x1b[36m%s\x1b[0m`, `  SYMPORA - Symposium Management Portal (by Jaishree K)   `);
    console.log(`\x1b[36m%s\x1b[0m`, `==========================================================`);
    console.log(`  Admin Credentials:`);
    console.log(`    Email:    jaishree@sympora.edu`);
    console.log(`    Password: Admin@123`);
    console.log(`  Student Credentials:`);
    console.log(`    Email:    rahul@student.edu`);
    console.log(`    Password: User@123`);
    console.log(`  Events seeded:        ${createdEvents.length}`);
    console.log(`  Registrations seeded: ${registrations.length}`);
    console.log(`  MongoDB Compass URI:  mongodb://127.0.0.1:27017/symposium_portal`);
    console.log(`\x1b[36m%s\x1b[0m`, `==========================================================`);
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
