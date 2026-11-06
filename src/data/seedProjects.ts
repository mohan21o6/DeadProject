import { Project, Review, Task, ResourceItem, TeamMember } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Smart Attendance System',
    slug: 'smart-attendance-system',
    acronym: 'SAS',
    shortName: 'Smart Attendance',
    aliases: ['Attendance Management System', 'Smart Attendance Tracker', 'Facial Attendance System', 'Automated Attendance Management'],
    keywords: ['Attendance', 'Attendance Management', 'Face Recognition', 'Computer Vision', 'AI', 'Deep Learning', 'Biometric Attendance', 'Roll Call Automation'],
    tags: ['Attendance', 'Attendance Management', 'AI', 'Computer Vision', 'Python', 'Face Recognition'],
    organization: 'Andhra University Informatics & AI Lab',
    relatedIndustries: ['Education Technology (EdTech)', 'Enterprise HR Tech', 'Smart Campus'],
    applicationAreas: ['Higher Education Attendance', 'Corporate Workforce Tracking'],
    description: 'AI based face recognition attendance system with automated admin dashboard, real-time tracking, spoof detection and detailed exportable analytics.',
    problemStatement: 'Manual roll call and biometric fingerprint scanners in large Indian lecture halls are slow, prone to proxy attendance, and unhygienic in post-pandemic scenarios.',
    objective: 'Deploy a high-speed non-intrusive facial recognition attendance system capable of processing 60 students per minute with liveness verification.',
    domain: 'AI/ML',
    category: 'Computer Vision',
    technologies: ['Python', 'OpenCV', 'React', 'MongoDB', 'Tailwind', 'FastAPI'],
    features: [
      'Face Recognition with 99.2% accuracy',
      'Attendance Tracking & Auto Roll-call',
      'Admin Dashboard with Role Management',
      'Reports & CSV/Excel Analytics',
      'User Authentication with 2FA',
      'Real-time Updates via WebSockets',
      'Anti-spoofing / Liveness Detection',
      'Automated Parent Email Alerts'
    ],
    status: 'Completed',
    difficulty: 'Medium',
    teamSize: 3,
    duration: '6 Weeks',
    year: 2024,
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    institution: 'Andhra University College of Engineering',
    requiredSkills: ['Python', 'OpenCV', 'React', 'Node.js', 'MongoDB', 'Computer Vision'],
    hardwareRequirements: ['1080p 60fps Wide Angle Camera', 'NVIDIA GTX 1650 or higher GPU'],
    softwareRequirements: ['Python 3.10', 'CUDA 11.8', 'Node.js 18+'],
    images: [
      'https://images.unsplash.com/photo-1507146426996-ef0538894158?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/smart-attendance-ai',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    liveDemoUrl: 'https://smart-attendance-ai.demo.dev',
    documentationUrl: 'https://docs.deadproject.in/projects/smart-attendance',
    datasetUrl: 'https://kaggle.com/datasets/attendance-face-dataset',
    researchPaperUrl: 'https://ieeexplore.ieee.org/document/984210',
    rating: 4.3,
    reviewCount: 245,
    viewCount: 12400,
    stars: 1280,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 42,
      level: 'MEDIUM',
      factors: {
        complexity: 'Medium',
        time: 'Medium',
        cost: 'Low',
        hardware: 'Medium',
        skills: 'Medium'
      },
      recommendations: [
        'Use pre-trained FaceNet or InsightFace models to reduce initial training time.',
        'Implement frame throttling so camera streams do not overload lightweight local servers.',
        'Add fallback manual attendance override for low-lighting lecture halls.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-1',
      name: 'Rahul Kumar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      institution: 'Andhra University'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z'
  },
  {
    id: 'proj-2',
    name: 'Smart Agriculture Monitoring',
    slug: 'smart-agriculture-monitoring',
    acronym: 'SAM',
    shortName: 'Smart Agriculture',
    aliases: ['Smart Farming System', 'AgriTech Crop Monitor', 'Precision Farming Platform', 'Smart Farming', 'Smart Agro IoT'],
    keywords: ['Smart Farming', 'Agriculture', 'Farming', 'AgriTech', 'Crop Monitoring', 'Soil Moisture', 'Precision Agriculture', 'IoT Farming'],
    tags: ['Smart Farming', 'Agriculture', 'Farming', 'IoT', 'AgriTech', 'Sensors'],
    organization: 'JNTU Agro-IoT Research Cell',
    relatedIndustries: ['Agriculture & AgriTech', 'Smart Farming', 'Precision Farming', 'Environmental Monitoring'],
    applicationAreas: ['Irrigation Automation', 'Crop Disease Prevention', 'Soil Health Analytics'],
    description: 'Crop monitoring using IoT sensors and AI disease detection for precision irrigation and soil health optimization.',
    problemStatement: 'Smallholder farmers in semi-arid zones suffer up to 35% crop loss due to delayed disease identification and unscientific over-watering.',
    objective: 'Build an affordable solar-powered IoT probe network feeding soil NPK, moisture, and temperature into a smartphone advisory app.',
    domain: 'Agriculture',
    category: 'IoT & Edge AI',
    technologies: ['IoT', 'AI/ML', 'Arduino', 'Python', 'React Native', 'Firebase'],
    features: [
      'Soil Moisture & Temperature Sensing',
      'NPK Chemical Sensor Integration',
      'Automated Drip Irrigation Relays',
      'AI Leaf Disease Detection via Camera',
      'Vernacular Voice Advisory (Hindi/Telugu)',
      'Weather Forecast Integration API',
      'Offline-first Mobile App Sync'
    ],
    status: 'In Progress',
    difficulty: 'Medium',
    teamSize: 4,
    duration: '10 Weeks',
    year: 2024,
    state: 'Telangana',
    city: 'Hyderabad',
    institution: 'JNTU College of Engineering Hyderabad',
    requiredSkills: ['IoT', 'Embedded C', 'Python', 'React Native', 'Firebase', 'Circuit Design'],
    hardwareRequirements: ['ESP32 Dev Module', 'Capacitive Soil Moisture Sensor v1.2', 'DHT22 Sensor', 'Solar Panel 5W'],
    softwareRequirements: ['Arduino IDE', 'PlatformIO', 'Firebase Console'],
    images: [
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/smart-agri-iot',
    youtubeUrl: 'https://www.youtube.com/watch?v=sample-agri',
    documentationUrl: 'https://docs.deadproject.in/projects/smart-agri',
    datasetUrl: 'https://plantvillage.psu.edu/',
    rating: 4.1,
    reviewCount: 182,
    viewCount: 8200,
    stars: 820,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 55,
      level: 'MEDIUM',
      factors: {
        complexity: 'Medium',
        time: 'High',
        cost: 'Medium',
        hardware: 'High',
        skills: 'Medium'
      },
      recommendations: [
        'Standardize sensor calibration before field deployment to avoid false moisture readings.',
        'Use deep sleep mode on ESP32 microcontrollers to prolong battery life to 6+ months.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-2',
      name: 'Sneha Reddy',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      institution: 'JNTU Hyderabad'
    },
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-04-10T11:00:00Z'
  },
  {
    id: 'proj-3',
    name: 'Voice Based Home Automation',
    slug: 'voice-based-home-automation',
    description: 'Control home appliances using offline voice commands on Raspberry Pi with secure local mesh networking and zero cloud dependency.',
    problemStatement: 'Cloud-based smart home systems (Alexa/Google Home) have privacy concerns, latency over slow rural broadband, and complete failure during internet outages.',
    objective: 'Create an edge-computed speech recognition hub for household relays operating in offline local environments.',
    domain: 'IoT',
    category: 'Embedded Systems',
    technologies: ['IoT', 'Web', 'Arduino', 'Node.js', 'Python', 'Vosk Voice'],
    features: [
      'Offline Wake-word & Intent Recognition',
      '4-Channel Relay Switching',
      'Local Web Dashboard & PWA',
      'Energy Consumption Logger',
      'Scheduled Timer Triggers',
      'Multi-room RF Transmitter Link'
    ],
    status: 'Incomplete',
    difficulty: 'Medium',
    teamSize: 2,
    duration: '4 Weeks',
    year: 2023,
    state: 'Karnataka',
    city: 'Bengaluru',
    institution: 'RV College of Engineering',
    requiredSkills: ['Raspberry Pi', 'Python', 'Vosk Audio', 'Node.js', 'Hardware Interfacing'],
    hardwareRequirements: ['Raspberry Pi 4 (2GB)', 'USB Microphone Array', '4-Channel 5V Relay Module'],
    softwareRequirements: ['Raspberry Pi OS Lite', 'Vosk Speech API'],
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/offline-voice-home',
    rating: 3.8,
    reviewCount: 94,
    viewCount: 6100,
    stars: 430,
    failureReasons: [
      {
        factor: 'Lack of knowledge',
        title: 'Acoustic Echo Cancellation & Ambient Noise Failures',
        description: 'The team struggled to filter ceiling fan and television background noise, causing speech recognition accuracy to drop below 50% in real living room tests.',
        lessonsLearned: [
          'Off-the-shelf single microphones are inadequate for far-field audio capture.',
          'Dual microphone arrays with dedicated DSP hardware (like ReSpeaker) are mandatory for clean voice isolation.'
        ],
        recommendedAlternative: 'Use an ESP32-S3 with built-in dual mic noise filtering and pre-trained lightweight TFLite keyword spotting models.'
      }
    ],
    riskAnalysis: {
      score: 68,
      level: 'HIGH',
      factors: {
        complexity: 'High',
        time: 'Medium',
        cost: 'Medium',
        hardware: 'High',
        skills: 'High'
      },
      recommendations: [
        'Test acoustic isolation early in actual noisy room conditions.',
        'Use dedicated hardware audio DSPs instead of software filtering.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-3',
      name: 'Aditya Sharma',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      institution: 'RV College of Engineering'
    },
    createdAt: '2023-09-10T12:00:00Z',
    updatedAt: '2023-11-25T16:20:00Z'
  },
  {
    id: 'proj-4',
    name: 'Smart Waste Management',
    slug: 'smart-waste-management',
    description: 'Automated garbage bin fill-level monitoring with LoRaWAN wireless telemetry and optimal municipal garbage truck route generation.',
    problemStatement: 'Overflowing municipal dustbins cause public health hazards and fuel is wasted by garbage trucks checking empty bins across the city.',
    objective: 'Implement smart ultrasonic bin sensors connected to a GIS dashboard that calculates the shortest fuel-efficient route for municipal trucks.',
    domain: 'IoT',
    category: 'Smart Cities',
    technologies: ['IoT', 'Arduino', 'Python', 'Leaflet.js', 'LoRaWAN', 'FastAPI'],
    features: [
      'Ultrasonic Bin Level Measurement',
      'LoRa Long-Range Telemetry (up to 5km)',
      'Municipal Route Optimization Engine',
      'SMS Alert on Bin Overflow & Fire Alarm',
      'Solar Battery Management System'
    ],
    status: 'Abandoned',
    difficulty: 'Hard',
    teamSize: 3,
    duration: '8 Weeks',
    year: 2023,
    state: 'Tamil Nadu',
    city: 'Chennai',
    institution: 'Anna University, CEG Campus',
    requiredSkills: ['LoRaWAN', 'Arduino', 'Python', 'Graph Algorithms', 'GIS'],
    hardwareRequirements: ['LoRa Gateway SX1302', 'LoRa Node ESP32', 'JSN-SR04T Waterproof Ultrasonic Sensor'],
    images: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/smart-waste-lora',
    rating: 3.1,
    reviewCount: 65,
    viewCount: 4800,
    stars: 210,
    failureReasons: [
      {
        factor: 'Hardware',
        title: 'Sensor Corrosion & LoRa Gateway Signal Attenuation',
        description: 'The ultrasonic sensors degraded rapidly from toxic leachate vapors inside bins, and LoRa gateway costs exceeded the student budget. Deployment halted after 3 weeks.',
        lessonsLearned: [
          'Standard plastic ultrasonic sensors cannot survive organic decomposition vapors.',
          'LoRa gateway installation on tall urban buildings requires municipal permits that took 4+ months to obtain.'
        ],
        recommendedAlternative: 'Use IP67 stainless steel laser distance time-of-flight sensors and cellular NB-IoT SIMs instead of dedicated LoRa gateways.'
      }
    ],
    riskAnalysis: {
      score: 78,
      level: 'HIGH',
      factors: {
        complexity: 'High',
        time: 'High',
        cost: 'High',
        hardware: 'High',
        skills: 'Medium'
      },
      recommendations: [
        'Budget for industrial-grade IP68 enclosures.',
        'Consider 4G/NB-IoT to bypass the need for physical LoRa base stations.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-4',
      name: 'Karthik Raja',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      institution: 'Anna University'
    },
    createdAt: '2023-03-12T09:00:00Z',
    updatedAt: '2023-06-15T18:00:00Z'
  },
  {
    id: 'proj-5',
    name: 'Smart Drone Delivery System',
    slug: 'smart-drone-delivery-system',
    description: 'Autonomous quadcopter delivery platform for emergency medicine transport in hilly terrains with GPS waypoint navigation and fail-safe return.',
    problemStatement: 'Remote villages in Western Ghats and Himalayan foothills face fatal delays in receiving anti-venom and emergency cardiac medicines.',
    objective: 'Build an autonomous 2kg payload UAV capable of 15km round trips with cellular telemetry and automatic landing zone target detection.',
    domain: 'Robotics',
    category: 'Autonomous Systems',
    technologies: ['IoT', 'AI/ML', 'ROS', 'Python', 'C++', 'ArduPilot'],
    features: [
      'Pixhawk Autopilot Integration',
      'Optical Flow Precision Landing',
      '4G LTE Telemetry Uplink',
      'Emergency Parachute Deploy Mechanism',
      'Hospital Dispatch Web Interface'
    ],
    status: 'Paused',
    difficulty: 'Advanced',
    teamSize: 5,
    duration: '14 Weeks',
    year: 2023,
    state: 'Maharashtra',
    city: 'Pune',
    institution: 'COEP Technological University',
    requiredSkills: ['ArduPilot', 'ROS2', 'Computer Vision', 'Aeronautical Dynamics', 'C++'],
    hardwareRequirements: ['Hexacopter Carbon Frame', 'Pixhawk 6X', 'Holybro Telemetry Radio', 'DJI ESC & Motors'],
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/drone-med-delivery',
    rating: 2.8,
    reviewCount: 42,
    viewCount: 7100,
    stars: 310,
    failureReasons: [
      {
        factor: 'Technical complexity',
        title: 'Regulatory DGCA Approvals & Motor ESC Overheating Under Payload',
        description: 'The quadcopter crashed twice during 2kg payload trials due to thermal throttling of ESCs. Additionally, strict DGCA green/yellow zone airspace permissions stalled outdoor tests.',
        lessonsLearned: [
          'Hardware-in-the-loop (HIL) Gazebo simulations must precede physical airframe builds.',
          'Drone regulatory compliance in India requires certified Beyond Visual Line of Sight (BVLOS) clearances.'
        ],
        recommendedAlternative: 'Build a Gazebo/AirSim digital twin simulation first, or collaborate with a DGCA-approved drone testing range.'
      }
    ],
    riskAnalysis: {
      score: 88,
      level: 'CRITICAL',
      factors: {
        complexity: 'High',
        time: 'High',
        cost: 'High',
        hardware: 'High',
        skills: 'High'
      },
      recommendations: [
        'Shift to full ROS2 simulation before purchasing expensive carbon frames.',
        'Check DGCA DigitalSky airspace restrictions for your campus latitude/longitude.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-5',
      name: 'Rohan Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
      institution: 'COEP Pune'
    },
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2023-12-05T14:00:00Z'
  },
  {
    id: 'proj-6',
    name: 'VR Based Virtual Classroom',
    slug: 'vr-based-virtual-classroom',
    description: 'Immersive WebXR 3D classroom for collaborative 3D organ dissection and mechanical engineering simulations with spatial audio.',
    problemStatement: 'Engineering and medical students in tier-2 colleges lack access to expensive physical laboratories and CAD mockups.',
    objective: 'Deliver browser-based 3D virtual interactive labs accessible via affordable VR headsets and standard desktop browsers.',
    domain: 'Web',
    category: 'AR / VR & WebXR',
    technologies: ['Web', 'VR', 'Three.js', 'WebXR', 'Node.js', 'WebRTC'],
    features: [
      'Multiplayer 3D Classroom Avatars',
      'Spatial 3D Positional Audio',
      'Interactive 3D GLTF CAD Models',
      'Real-time Whiteboard Synchronizer',
      'Cross-platform WebXR (Meta Quest & Desktop)'
    ],
    status: 'Incomplete',
    difficulty: 'Hard',
    teamSize: 3,
    duration: '8 Weeks',
    year: 2024,
    state: 'Delhi',
    city: 'New Delhi',
    institution: 'Delhi Technological University (DTU)',
    requiredSkills: ['Three.js', 'WebGL', 'WebSockets', 'WebRTC', 'Blender 3D'],
    softwareRequirements: ['Three.js 0.160', 'Node.js 20', 'Blender 4.0'],
    images: [
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/webxr-classroom',
    rating: 3.4,
    reviewCount: 51,
    viewCount: 5400,
    stars: 390,
    failureReasons: [
      {
        factor: 'Time',
        title: '3D Asset Optimization & Network Latency Stalls',
        description: 'Uncompressed high-poly 3D models caused mobile VR browser frame rates to drop to 18 FPS, inducing motion sickness. Project timeline ended before mesh LOD pipeline was finished.',
        lessonsLearned: [
          'High poly 3D assets must be decimated and compressed using Draco / KTX2 textures.',
          'WebRTC data channel synchronization requires predictive client-side interpolation.'
        ],
        recommendedAlternative: 'Use PlayCanvas or Babylon.js engines with Draco compression and strict 50,000 polygon limits per scene.'
      }
    ],
    riskAnalysis: {
      score: 72,
      level: 'HIGH',
      factors: {
        complexity: 'High',
        time: 'High',
        cost: 'Medium',
        hardware: 'Medium',
        skills: 'High'
      },
      recommendations: [
        'Automate Draco 3D mesh compression in your asset pipeline.',
        'Target 72 FPS baseline before adding multi-user networking.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-6',
      name: 'Pooja Verma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      institution: 'Delhi Technological University'
    },
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-03-30T16:00:00Z'
  },
  {
    id: 'proj-7',
    name: 'Decentralized Academic Credential Verification',
    slug: 'decentralized-academic-credentials',
    description: 'Ethereum & Polygon smart contract ecosystem for tamper-proof university degree issuance, QR verification, and zero-knowledge student privacy.',
    problemStatement: 'Fake college certificates and lengthy 3-week verification delays by third-party background check agencies cost Indian companies crores annually.',
    objective: 'Enable universities to issue W3C Verifiable Credentials on Polygon with instant one-second cryptographic verification.',
    domain: 'Blockchain',
    category: 'Web3 & Identity',
    technologies: ['Blockchain', 'Solidity', 'Polygon', 'React', 'Ethers.js', 'IPFS'],
    features: [
      'ERC-721 Soulbound Degree Tokens',
      'IPFS Encrypted PDF Transcripts',
      'One-click Instant QR Scanner',
      'University Registrar Multi-sig Portal',
      'Zero-Knowledge Proof of Graduation'
    ],
    status: 'Completed',
    difficulty: 'Hard',
    teamSize: 4,
    duration: '12 Weeks',
    year: 2024,
    state: 'Karnataka',
    city: 'Bengaluru',
    institution: 'IIIT Bangalore',
    requiredSkills: ['Solidity', 'Hardhat', 'React', 'Ethers.js', 'Cryptography'],
    softwareRequirements: ['Solidity 0.8.20', 'Hardhat', 'Metamask'],
    images: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/poly-credentials',
    liveDemoUrl: 'https://credentials.polyverified.in',
    documentationUrl: 'https://docs.polyverified.in',
    researchPaperUrl: 'https://arxiv.org/abs/2401.99812',
    rating: 4.6,
    reviewCount: 312,
    viewCount: 14200,
    stars: 1540,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 35,
      level: 'LOW',
      factors: {
        complexity: 'High',
        time: 'Medium',
        cost: 'Low',
        hardware: 'Low',
        skills: 'High'
      },
      recommendations: [
        'Audit smart contracts for reentrancy and signature malleability before deploying to mainnet.',
        'Use gasless meta-transactions (Biconomy/ERC-4337) so colleges do not need to buy crypto tokens.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-7',
      name: 'Varun Swaminathan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      institution: 'IIIT Bangalore'
    },
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-05-10T18:00:00Z'
  },
  {
    id: 'proj-8',
    name: 'AI Healthcare Triage & ECG Analyzer',
    slug: 'ai-healthcare-triage-ecg',
    acronym: 'AI-ECG',
    shortName: 'AI ECG Triage',
    aliases: ['CardioAI Triage', 'AI Medical Triage', 'ECG Deep Learning Analyzer', 'Rural Healthcare AI'],
    keywords: ['AI', 'Healthcare', 'ECG', 'Cardiology', 'Deep Learning', 'Medical Diagnostics', 'Artificial Intelligence', 'Arrhythmia'],
    tags: ['AI', 'Healthcare', 'Deep Learning', 'Python', 'PyTorch', 'Cardiology'],
    organization: 'CMC Vellore & Biomedical Informatics Unit',
    relatedIndustries: ['Healthcare Technology (HealthTech)', 'Biomedical Informatics', 'Telemedicine'],
    applicationAreas: ['Primary Health Center Triage', 'Rural Emergency Response', 'Cardiovascular Monitoring'],
    description: 'Deep Learning arrhythmia detection on 12-lead ECG signals with automated urgency triage for rural Primary Health Centres (PHCs).',
    problemStatement: 'Over 70% of rural Indian PHCs do not have a full-time cardiologist on duty, delaying life-saving thrombolytic therapy during acute myocardial infarctions.',
    objective: 'Provide a 98.4% accurate ResNet-1D arrhythmia classifier deployable on a $40 Raspberry Pi or Android tablet.',
    domain: 'Healthcare',
    category: 'Biomedical AI',
    technologies: ['Healthcare', 'AI/ML', 'Python', 'PyTorch', 'FastAPI', 'Flutter', 'Docker'],
    features: [
      '12-Lead ECG Waveform Digitization',
      'ResNet-1D Arrhythmia Classifier',
      'Instant WhatsApp Critical Alert to On-call Doctor',
      'Automated PDF Diagnostic Report',
      'Low Bandwidth FHIR Protocol Sync'
    ],
    status: 'Completed',
    difficulty: 'Advanced',
    teamSize: 4,
    duration: '16 Weeks',
    year: 2024,
    state: 'Tamil Nadu',
    city: 'Vellore',
    institution: 'Vellore Institute of Technology (VIT)',
    requiredSkills: ['PyTorch', 'Biomedical Signal Processing', 'FastAPI', 'Flutter', 'Docker'],
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/ecg-triage-ai',
    youtubeUrl: 'https://www.youtube.com/watch?v=sample-ecg',
    researchPaperUrl: 'https://doi.org/10.1016/j.bspc.2024.106200',
    datasetUrl: 'https://physionet.org/content/ptb-xl/',
    rating: 4.8,
    reviewCount: 420,
    viewCount: 19800,
    stars: 2100,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 48,
      level: 'MEDIUM',
      factors: {
        complexity: 'High',
        time: 'High',
        cost: 'Low',
        hardware: 'Medium',
        skills: 'High'
      },
      recommendations: [
        'Validate models against diverse patient demographics across multiple hospital partners.',
        'Implement confidence calibration to prevent overconfident false negatives on rare arrhythmias.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-8',
      name: 'Dr. Ananya Sen',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      institution: 'VIT Vellore'
    },
    createdAt: '2024-01-05T09:30:00Z',
    updatedAt: '2024-04-18T12:00:00Z'
  },
  {
    id: 'proj-9',
    name: 'Automated Cyber Threat Intelligence Honeypot',
    slug: 'automated-cyber-threat-honeypot',
    description: 'Distributed medium-interaction honeypots simulating industrial SCADA protocols (Modbus, BACnet) to trap and catalog 0-day exploit payloads.',
    problemStatement: 'Indian critical infrastructure and smart grids are targeted by targeted ransomware, but organizations lack early telemetry before networks are compromised.',
    objective: 'Deploy low-cost cloud and edge decoys capturing attacker TTPs and streaming IOCs to an automated MITRE ATT&CK dashboard.',
    domain: 'Cybersecurity',
    category: 'Network Security',
    technologies: ['Cybersecurity', 'Python', 'Go', 'Elasticsearch', 'Docker', 'Kibana'],
    features: [
      'Modbus & DNP3 SCADA Protocol Emulation',
      'Real-time PCAP Packet Capture & Payload Dump',
      'MITRE ATT&CK Matrix Auto-tagging',
      'STIX/TAXII Threat Intelligence Feed Export',
      'Automated IP Blacklist Push to AWS/Cloudflare WAF'
    ],
    status: 'Completed',
    difficulty: 'Advanced',
    teamSize: 3,
    duration: '10 Weeks',
    year: 2024,
    state: 'Kerala',
    city: 'Kochi',
    institution: 'Cochin University of Science and Technology (CUSAT)',
    requiredSkills: ['Go', 'Python', 'TCP/IP Networking', 'Docker', 'Reverse Engineering'],
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/scada-honeynet',
    liveDemoUrl: 'https://threatintel.cusat-sec.in',
    rating: 4.5,
    reviewCount: 168,
    viewCount: 9500,
    stars: 980,
    riskAnalysis: {
      score: 38,
      level: 'LOW',
      factors: {
        complexity: 'High',
        time: 'Medium',
        cost: 'Low',
        hardware: 'Low',
        skills: 'High'
      },
      recommendations: [
        'Isolate honeypot VPCs with strict outbound egress filtering to prevent attackers from using your nodes for DDoS amplification.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-9',
      name: 'Nikhil Menon',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      institution: 'CUSAT'
    },
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-05-20T16:00:00Z'
  },
  {
    id: 'proj-10',
    name: 'AI Traffic Congestion Predictor & Smart Lights',
    slug: 'ai-traffic-congestion-predictor',
    acronym: 'ATC',
    shortName: 'AI Traffic Lights',
    aliases: ['Smart Traffic Management System', 'AI Traffic Controller', 'Urban Traffic Predictor', 'Intelligent Traffic Signal'],
    keywords: ['AI', 'Artificial Intelligence', 'Traffic Management', 'Smart Cities', 'Computer Vision', 'Deep Learning', 'Traffic Signal', 'YOLOv8', 'Intelligent Transportation'],
    tags: ['AI', 'Traffic', 'Smart Cities', 'Computer Vision', 'Python', 'YOLOv8'],
    organization: 'IIT Bombay Urban Mobility Research Group',
    relatedIndustries: ['Intelligent Transportation Systems (ITS)', 'Smart Cities', 'Urban Traffic Management'],
    applicationAreas: ['Intersection Signal Timing', 'Emergency Corridor Clearance', 'Congestion Relief'],
    description: 'YOLOv8 vehicle queue counter and reinforcement learning traffic signal controller to minimize vehicle waiting time at Indian rotary junctions.',
    problemStatement: 'Fixed timer traffic signals cause severe bottle-necks in Indian metro junctions because they ignore real-time lane density variations.',
    objective: 'Implement an adaptive traffic light system adjusting green-signal durations dynamically from live CCTV RTSP video streams.',
    domain: 'AI/ML',
    category: 'Computer Vision & RL',
    technologies: ['AI/ML', 'Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'SUMO Simulator'],
    features: [
      'Real-time Vehicle Classification (Auto, Bus, Bike, Car)',
      'Queue Length & Density Estimation',
      'Q-Learning Dynamic Green Light Duration Allocator',
      'Emergency Ambulance Priority Green Corridor',
      'SUMO Microscopic Traffic Simulation Benchmark'
    ],
    status: 'In Progress',
    difficulty: 'Hard',
    teamSize: 4,
    duration: '12 Weeks',
    year: 2024,
    state: 'Maharashtra',
    city: 'Mumbai',
    institution: 'IIT Bombay',
    requiredSkills: ['Python', 'YOLOv8', 'PyTorch', 'Reinforcement Learning', 'SUMO'],
    images: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/smart-traffic-rl',
    rating: 4.4,
    reviewCount: 210,
    viewCount: 11200,
    stars: 1150,
    riskAnalysis: {
      score: 58,
      level: 'MEDIUM',
      factors: {
        complexity: 'High',
        time: 'Medium',
        cost: 'Medium',
        hardware: 'High',
        skills: 'High'
      },
      recommendations: [
        'Train object detectors on Indian traffic datasets (IndiaDriving, IDD) rather than generic COCO to detect autorickshaws and non-standard vehicles.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-10',
      name: 'Tanvi Joshi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      institution: 'IIT Bombay'
    },
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2024-05-15T15:00:00Z'
  },
  {
    id: 'proj-11',
    name: 'Automated Hydroponics Nutrient Dosing System',
    slug: 'automated-hydroponics-nutrient-dosing',
    acronym: 'AHND',
    shortName: 'Hydroponics Dosing System',
    aliases: ['Smart Farming Hydroponics', 'Precision Hydroponics Dosing', 'Automated Vertical Farming', 'Smart Farming Nutrient Controller'],
    keywords: ['Smart Farming', 'Hydroponics', 'Agriculture', 'Farming', 'AgriTech', 'IoT Farming', 'Nutrient Dosing', 'Precision Agriculture'],
    tags: ['Smart Farming', 'Hydroponics', 'Agriculture', 'Farming', 'IoT', 'AgriTech'],
    organization: 'Thapar Precision Agriculture & Automation Lab',
    relatedIndustries: ['Smart Farming', 'Agriculture & AgriTech', 'Vertical Farming & CEA'],
    applicationAreas: ['Indoor Hydroponic Farms', 'Greenhouse Precision Dosing', 'Urban Agriculture'],
    description: 'Closed-loop IoT hydroponics control with EC/pH closed-loop peristaltic pumps and cloud analytics for vertical indoor lettuce farms.',
    problemStatement: 'Manual nutrient solution testing in vertical hydroponic farms causes frequent pH crashes and severe root burn, ruining full crop cycles.',
    objective: 'Create a micro-controlled automatic dosing rig keeping water electrical conductivity (EC) and pH within target 0.1 delta tolerances.',
    domain: 'Agriculture',
    category: 'IoT Automation',
    technologies: ['IoT', 'Arduino', 'C++', 'MQTT', 'React', 'Node.js'],
    features: [
      'Continuous Analog pH & EC Liquid Probes',
      'Automated Peristaltic Pump Dosing Relays',
      'Water Temperature & Dissolved Oxygen Monitor',
      'MQTT Real-time Telemetry Dashboard',
      'Nutrient Depletion Forecast Model'
    ],
    status: 'Abandoned',
    difficulty: 'Medium',
    teamSize: 3,
    duration: '8 Weeks',
    year: 2023,
    state: 'Punjab',
    city: 'Patiala',
    institution: 'Thapar Institute of Engineering and Technology',
    requiredSkills: ['Embedded C', 'IoT', 'Chemistry & Nutrient Solution', 'Node.js'],
    images: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/hydro-doser',
    rating: 3.2,
    reviewCount: 47,
    viewCount: 3900,
    stars: 180,
    failureReasons: [
      {
        factor: 'Budget',
        title: 'Laboratory Grade pH Probe Drift & Peristaltic Pump Burnout',
        description: 'Cheap $10 analog pH probes drifted by 1.5 pH within 72 hours of constant submersion, causing the pumps to over-dose nitric acid and kill the plants. Industrial probes cost 10x the team budget.',
        lessonsLearned: [
          'Consumer glass pH sensors must be calibrated weekly and cannot stay submerged 24/7 without automated reference flushing.',
          'Always implement hard safety cut-offs limiting maximum daily pump run-time to prevent lethal overdoses.'
        ],
        recommendedAlternative: 'Use differential optical spectroscopy or optical pH indicator test strips with camera vision inspection.'
      }
    ],
    riskAnalysis: {
      score: 75,
      level: 'HIGH',
      factors: {
        complexity: 'Medium',
        time: 'Medium',
        cost: 'High',
        hardware: 'High',
        skills: 'Medium'
      },
      recommendations: [
        'Add software watchdog timers to prevent pumps from dispensing more than 50ml per hour.',
        'Use double junction industrial pH probes.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-11',
      name: 'Harpreet Singh',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      institution: 'Thapar University'
    },
    createdAt: '2023-04-10T10:00:00Z',
    updatedAt: '2023-07-01T12:00:00Z'
  },
  {
    id: 'proj-12',
    name: 'Solar Powered Smart EV Charging Station',
    slug: 'solar-smart-ev-charging-station',
    description: 'Dynamic load balancing solar PV-to-EV charging kiosk with OCPP 2.0.1 protocol compliance, slot reservation app, and UPI payments.',
    problemStatement: 'College campuses and commercial buildings face transformer grid overloads when multiple electric two-wheelers charge at peak hours.',
    objective: 'Build an off-grid solar-integrated Level-2 charging station with real-time solar surplus power distribution and automated UPI payment gate.',
    domain: 'IoT',
    category: 'CleanTech & Energy',
    technologies: ['IoT', 'Web', 'Python', 'React', 'FastAPI', 'OCPP 2.0'],
    features: [
      'OCPP 2.0.1 JSON WebSocket Communication',
      'Solar MPPT Battery Priority Charging',
      'Dynamic Current Throttling (6A to 16A)',
      'UPI QR Code Payment Gateway',
      'PWA Mobile Booking & Queue App'
    ],
    status: 'Completed',
    difficulty: 'Hard',
    teamSize: 4,
    duration: '14 Weeks',
    year: 2024,
    state: 'Gujarat',
    city: 'Ahmedabad',
    institution: 'Nirma University',
    requiredSkills: ['Power Electronics', 'OCPP', 'Python', 'React', 'Payment Gateways'],
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/solar-ev-ocpp',
    liveDemoUrl: 'https://solarcharge.nirma.in',
    rating: 4.7,
    reviewCount: 195,
    viewCount: 10400,
    stars: 1220,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 40,
      level: 'LOW',
      factors: {
        complexity: 'Medium',
        time: 'Medium',
        cost: 'Medium',
        hardware: 'Medium',
        skills: 'Medium'
      },
      recommendations: [
        'Include galvanic electrical isolation and emergency physical kill switches for high-voltage DC protection.'
      ]
    },
    sourceType: 'demo',
    source: 'Demo Showcase',
    license: 'MIT / Demo',
    attribution: 'DeadProject Starter Showcase Demo',
    verifiedFailureDetails: true,
    createdBy: {
      id: 'u-12',
      name: 'Jay Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      institution: 'Nirma University'
    },
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-04-28T17:00:00Z'
  },
  {
    id: 'proj-apsrtc-1',
    name: 'APSRTC Live Passenger Information & Bus Tracking System',
    slug: 'apsrtc-live-bus-tracking-system',
    acronym: 'APSRTC',
    shortName: 'APSRTC Live Track',
    aliases: ['APSRTC Bus Tracking', 'RTC Bus Tracker', 'Andhra Pradesh State Road Transport Corporation Telematics'],
    description: 'Real-time GPS bus tracking, passenger information system (PIS), and automated schedule dispatch network developed for Andhra Pradesh State Road Transport Corporation (APSRTC) fleet operations.',
    problemStatement: 'Passengers across rural and intercity bus routes in Andhra Pradesh face unpredictable transit delays and lack real-time bus arrival schedules at bus stations and mobile devices.',
    objective: 'Deploy GPS/GSM transponders across state RTC buses and stream live telemetry to a centralized dispatch and passenger mobile tracking app.',
    domain: 'IoT',
    category: 'Public Transit',
    technologies: ['IoT', 'Node.js', 'React', 'GPS', 'MQTT', 'WebSockets', 'PostgreSQL'],
    features: [
      'Live GPS Bus Tracking & Fleet Telemetry',
      'Accurate ETA Prediction Engine',
      'Automated Passenger Information Display (PIS)',
      'Bus Station Digital Information Boards',
      'Route Telemetry Dispatch & Schedule Adherence'
    ],
    status: 'Completed',
    difficulty: 'Hard',
    teamSize: 5,
    duration: '6 Months',
    year: 2023,
    state: 'Andhra Pradesh',
    city: 'Vijayawada',
    institution: 'APSRTC Operations & Technology Division / JNTU Kakinada',
    organization: 'Andhra Pradesh State Road Transport Corporation (APSRTC)',
    requiredSkills: ['IoT', 'Node.js', 'MQTT', 'GPS Telematics', 'React', 'PostgreSQL'],
    hardwareRequirements: ['Vehicle GPS/GSM Tracker Unit', 'CAN Bus Interfacing Cable', 'LED Destination Board Controller'],
    softwareRequirements: ['Node.js 18+', 'PostgreSQL / PostGIS', 'MQTT Broker (EMQX)', 'React 18'],
    images: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/apsrtc-bus-tracker',
    liveDemoUrl: 'https://apsrtc-livetrack.gov.in.demo',
    documentationUrl: 'https://docs.deadproject.in/projects/apsrtc-tracking',
    rating: 4.6,
    reviewCount: 42,
    viewCount: 4850,
    stars: 412,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 38,
      level: 'LOW',
      factors: {
        complexity: 'Medium',
        time: 'Medium',
        cost: 'Low',
        hardware: 'Medium',
        skills: 'Medium'
      },
      recommendations: [
        'Use edge-caching and dead-reckoning on mobile client when cellular signals fade in rural ghat road sections.'
      ]
    },
    keywords: ['APSRTC', 'RTC', 'Bus Tracking', 'Public Transit', 'Transport', 'GPS', 'Passenger Information System', 'PIS', 'Transit Telematics'],
    tags: ['APSRTC', 'RTC', 'Transport', 'Transit', 'Bus', 'Tracking', 'IoT'],
    relatedIndustries: ['Public Transportation', 'Intelligent Transportation Systems (ITS)', 'Fleet Management'],
    applicationAreas: ['Urban Transit', 'Intercity Bus Operations', 'Smart Mobility'],
    sourceType: 'external',
    source: 'National Transport Intelligence Initiative',
    license: 'Open Government Data (OGD) India / Public Sector Informatics',
    attribution: 'Verified public sector transit telematics initiative documented by APSRTC & CIRT India',
    verifiedFailureDetails: false,
    createdBy: {
      id: 'u-transport-ap',
      name: 'Ravi Teja Varma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      institution: 'APSRTC & JNTU Kakinada'
    },
    createdAt: '2023-11-10T08:00:00Z',
    updatedAt: '2024-04-12T14:00:00Z'
  },
  {
    id: 'proj-rtc-2',
    name: 'RTC Smart Transit Fleet Management & Automated Fare Collection',
    slug: 'rtc-smart-transit-fleet-management',
    acronym: 'RTC',
    shortName: 'RTC Smart Transit',
    aliases: ['RTC Transit Management', 'State RTC Fleet Telematics', 'RTC Bus Management System'],
    description: 'An enterprise fleet telematics and contactless electronic ticket issuing system (ETIM) for state Road Transport Corporations (RTC), featuring real-time vehicle dispatch, fuel monitoring, and passenger density analytics.',
    problemStatement: 'Traditional state road transport corporations incur revenue leakages and fleet scheduling bottlenecks due to disconnected paper ticketing and manual logbooks.',
    objective: 'Create a unified transit management platform combining cloud dispatch, IoT telemetry, and handheld ticket validator integration.',
    domain: 'IoT',
    category: 'Transportation & Logistics',
    technologies: ['Python', 'Java', 'Node.js', 'React', 'Docker', 'PostgreSQL', 'Kafka'],
    features: [
      'Electronic Ticket Issuance System (ETIS) Sync',
      'Depot Schedule Optimizer & Roster Automation',
      'Real-time Fuel & Odometer Telemetry',
      'Automated Revenue Reconciliation',
      'Central State RTC Operations Command Dashboard'
    ],
    status: 'In Progress',
    difficulty: 'Advanced',
    teamSize: 6,
    duration: '8 Months',
    year: 2024,
    state: 'Telangana',
    city: 'Hyderabad',
    institution: 'Telangana State Road Transport Research Group / Osmania University',
    organization: 'State Road Transport Corporation (RTC)',
    requiredSkills: ['Python', 'Java', 'Distributed Systems', 'IoT', 'PostgreSQL', 'Kafka'],
    hardwareRequirements: ['Handheld Android POS Ticket Terminal', 'Vehicle OBD-II Telematics Port Interfacer'],
    softwareRequirements: ['Java 17 / Spring Boot', 'Python 3.11', 'Apache Kafka', 'Docker'],
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/rtc-smart-transit-telematics',
    rating: 4.5,
    reviewCount: 28,
    viewCount: 3600,
    stars: 340,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 48,
      level: 'MEDIUM',
      factors: {
        complexity: 'High',
        time: 'High',
        cost: 'Medium',
        hardware: 'High',
        skills: 'High'
      },
      recommendations: [
        'Implement offline ticketing SQLite caches on handheld terminals with batch upload upon reaching depot Wi-Fi.'
      ]
    },
    keywords: ['RTC', 'Road Transport Corporation', 'Fleet Telematics', 'Public Transit', 'Transport', 'Bus Transit', 'Automated Ticketing', 'Transit Operations'],
    tags: ['RTC', 'Transport', 'Transit', 'Fleet Management', 'Bus', 'Ticketing', 'IoT'],
    relatedIndustries: ['Public Transportation', 'Intelligent Transportation Systems (ITS)', 'Commercial Fleet Operations'],
    applicationAreas: ['State Bus Fleet Management', 'Revenue Assurance', 'Public Transit Operations'],
    sourceType: 'external',
    source: 'National Transport Intelligence Initiative',
    license: 'CC BY 4.0',
    attribution: 'Open transit telematics research initiative with state transport enterprise data',
    verifiedFailureDetails: false,
    createdBy: {
      id: 'u-transport-ts',
      name: 'Kavitha Swaminathan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      institution: 'Osmania University College of Engineering'
    },
    createdAt: '2024-01-05T09:30:00Z',
    updatedAt: '2024-05-18T16:00:00Z'
  },
  {
    id: 'proj-vtc-3',
    name: 'VTC - Vehicle Tracking & Telematics Controller for Public Transport',
    slug: 'vtc-vehicle-tracking-controller',
    acronym: 'VTC',
    shortName: 'VTC Telematics Unit',
    aliases: ['Vehicle Tracking Controller', 'VTC Transport Tracker', 'Vehicle Transit Controller', 'AIS-140 VTC Unit'],
    description: 'An AIS-140 compliant Vehicle Tracking & Telematics Controller (VTC) embedded IoT system designed for state RTC buses and commercial transport fleets, integrating GNSS location streaming, emergency panic alerts, and vehicle health telemetry.',
    problemStatement: 'Public passenger transport vehicles require tamper-proof, government-compliant vehicle tracking controllers (VTC) to ensure passenger safety and operational fleet visibility under AIS-140 standards.',
    objective: 'Engineer a ruggedized ARM Cortex based VTC onboard unit with dual SIM connectivity, CAN bus diagnostics, and cloud transit gateway synchronization.',
    domain: 'IoT',
    category: 'Transportation & Logistics',
    technologies: ['Embedded C', 'Python', 'MQTT', 'C++', 'FreeRTOS', 'CAN Bus', 'Hardware Design'],
    features: [
      'AIS-140 Certified Vehicle Tracking Controller (VTC)',
      'Emergency Panic SOS Alert Switch Circuit',
      'CAN Bus Engine & Transmission Health Diagnostics',
      'Real-Time Transit Gateway MQTT Sync',
      'Internal Battery Backup with Anti-Tamper Detection'
    ],
    status: 'Completed',
    difficulty: 'Advanced',
    teamSize: 4,
    duration: '5 Months',
    year: 2023,
    state: 'Karnataka',
    city: 'Bengaluru',
    institution: 'BMS College of Engineering / Central Institute of Road Transport (CIRT) Research Cohort',
    organization: 'Intelligent Transport Systems (ITS) Research Group',
    requiredSkills: ['Embedded C', 'Python', 'FreeRTOS', 'CAN Bus', 'IoT', 'Hardware Engineering'],
    hardwareRequirements: ['STM32 ARM Cortex-M4 Microcontroller', 'Quectel GNSS/GSM Module', 'CAN Transceiver SN65HVD230'],
    softwareRequirements: ['FreeRTOS Kernel', 'Python 3.10', 'PlatformIO', 'MQTT Gateway'],
    images: [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80'
    ],
    githubUrl: 'https://github.com/deadproject-hub/vtc-ais140-telematics',
    rating: 4.7,
    reviewCount: 35,
    viewCount: 4200,
    stars: 390,
    isFeatured: true,
    isVerified: true,
    riskAnalysis: {
      score: 44,
      level: 'LOW',
      factors: {
        complexity: 'High',
        time: 'Medium',
        cost: 'Medium',
        hardware: 'High',
        skills: 'High'
      },
      recommendations: [
        'Adhere strictly to automotive grade surge protection (ISO 7637-2) to prevent alternator load-dump spikes from blowing the power rail.'
      ]
    },
    keywords: ['VTC', 'Vehicle Tracking Controller', 'RTC', 'Public Transport', 'Fleet Management', 'AIS-140', 'Bus Tracking', 'Telematics', 'Transit Telematics', 'Vehicle Tracking'],
    tags: ['VTC', 'RTC', 'Transport', 'Vehicle Tracking', 'IoT', 'Telematics', 'Automotive'],
    relatedIndustries: ['Automotive Telematics', 'Intelligent Transportation Systems (ITS)', 'Public Transit Safety'],
    applicationAreas: ['Public Bus Fleets', 'Commercial Transport Tracking', 'State Transport Corporation Integration'],
    sourceType: 'external',
    source: 'National Transport Intelligence Initiative',
    license: 'CC BY 4.0',
    attribution: 'Automotive telematics research documented in CIRT / ARAI safety compliance frameworks',
    verifiedFailureDetails: false,
    createdBy: {
      id: 'u-transport-ka',
      name: 'Abhishek Hegde',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      institution: 'BMS College of Engineering'
    },
    createdAt: '2023-10-15T11:00:00Z',
    updatedAt: '2024-03-22T13:45:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    projectId: 'proj-1',
    userId: 'u-101',
    userName: 'Rahul K.',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    userInstitution: 'IIT Madras',
    rating: 4.5,
    comment: 'Good project. The implementation is clean and the FaceNet pipeline works well, but deployment was a bit difficult on low-spec hardware. Adding frame skipping solved it.',
    helpfulCount: 12,
    unhelpfulCount: 2,
    date: '3 weeks ago'
  },
  {
    id: 'rev-2',
    projectId: 'proj-1',
    userId: 'u-102',
    userName: 'Sneha M.',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    userInstitution: 'BITS Pilani',
    rating: 4.0,
    comment: 'Very useful project. Can be improved with mobile app and push notifications for students when attendance is marked.',
    helpfulCount: 18,
    unhelpfulCount: 1,
    date: '1 month ago'
  },
  {
    id: 'rev-3',
    projectId: 'proj-1',
    userId: 'u-103',
    userName: 'Arjun V.',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    userInstitution: 'NIT Trichy',
    rating: 4.2,
    comment: 'Hardware camera resolution is key. Otherwise good concept, easily expandable for multi-camera lecture halls.',
    helpfulCount: 5,
    unhelpfulCount: 0,
    date: '2 months ago'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Create database schema & models',
    description: 'Design MongoDB schemas for Students, Classrooms, AttendanceLogs, and Admin Users.',
    status: 'DONE',
    priority: 'HIGH',
    assignee: {
      name: 'Mohan S.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    },
    dueDate: '2024-02-10',
    tags: ['Backend', 'MongoDB']
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Design UI mockup & design system',
    description: 'Complete Figma design for dashboard, live video feed card, and student analytics tables.',
    status: 'DONE',
    priority: 'MEDIUM',
    assignee: {
      name: 'Rahul K.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80'
    },
    dueDate: '2024-02-18',
    tags: ['UI/UX', 'Figma']
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Build detection model pipeline',
    description: 'Integrate MTCNN and InsightFace embedding models with OpenCV video capture loop.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    assignee: {
      name: 'Sneha M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
    },
    dueDate: '2024-03-05',
    tags: ['AI/ML', 'Python']
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    title: 'Image upload feature for student registration',
    description: 'Allow batch photo uploads with automated face quality checking and cropping.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignee: {
      name: 'Mohan S.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    },
    dueDate: '2024-03-12',
    tags: ['Frontend', 'React']
  },
  {
    id: 'task-5',
    projectId: 'proj-1',
    title: 'Model accuracy test on low-light dataset',
    description: 'Benchmark recognition precision against 500 challenging low light and rotated face images.',
    status: 'TESTING',
    priority: 'HIGH',
    assignee: {
      name: 'Sneha M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
    },
    dueDate: '2024-03-20',
    tags: ['Testing', 'QA']
  },
  {
    id: 'task-6',
    projectId: 'proj-1',
    title: 'Testing & bug fixes for multi-face camera concurrency',
    description: 'Handle edge cases where 10+ students walk into camera view simultaneously.',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: {
      name: 'Rahul K.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80'
    },
    dueDate: '2024-03-28',
    tags: ['Concurrency', 'Bugfix']
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Mohan Kumar',
    role: 'Full-Stack Lead',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    email: 'mohan.k@deadproject.in',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'JavaScript', 'TypeScript']
  },
  {
    id: 'tm-2',
    name: 'Rahul Sharma',
    role: 'ML & Python Engineer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    email: 'rahul.s@deadproject.in',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'FastAPI', 'Computer Vision']
  },
  {
    id: 'tm-3',
    name: 'Sai Priya',
    role: 'Database & Cloud Architect',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    email: 'sai.priya@deadproject.in',
    skills: ['Node.js', 'MongoDB', 'Docker', 'AWS', 'REST API']
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'InsightFace Python Deep Face Recognition Toolkit',
    type: 'GitHub',
    projectId: 'proj-1',
    projectName: 'Smart Attendance System',
    domain: 'AI/ML',
    url: 'https://github.com/deepinsight/insightface',
    description: 'State-of-the-art 2D and 3D face analysis toolbox with ArcFace and RetinaFace models.',
    stars: 18400,
    author: 'deepinsight',
    language: 'Python'
  },
  {
    id: 'res-2',
    title: 'Live Stream Multi-Person Face Attendance Demo & Architecture',
    type: 'YouTube',
    projectId: 'proj-1',
    projectName: 'Smart Attendance System',
    domain: 'AI/ML',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Complete walkthrough showing 60 FPS RTSP multi-threaded face tracking architecture.',
    author: 'AI Tech Talks India'
  },
  {
    id: 'res-3',
    title: 'PlantVillage Crop Disease Image Dataset',
    type: 'Dataset',
    projectId: 'proj-2',
    projectName: 'Smart Agriculture Monitoring',
    domain: 'Agriculture',
    url: 'https://www.kaggle.com/datasets/emmarex/plantdisease',
    description: '54,306 images of healthy and diseased plant leaves categorized across 38 class labels.',
    stars: 5200,
    author: 'Penn State University'
  },
  {
    id: 'res-4',
    title: 'LoRaWAN Long Range IoT Sensor Node Firmware',
    type: 'GitHub',
    projectId: 'proj-4',
    projectName: 'Smart Waste Management',
    domain: 'IoT',
    url: 'https://github.com/deadproject-hub/smart-waste-lora',
    description: 'ESP32 LMIC deep-sleep firmware for ultra-low power ultrasonic bin telemetry.',
    stars: 430,
    author: 'deadproject-hub',
    language: 'C++'
  },
  {
    id: 'res-5',
    title: 'PTB-XL ECG Diagnostic Arrhythmia Database',
    type: 'Dataset',
    projectId: 'proj-8',
    projectName: 'AI Healthcare Triage & ECG Analyzer',
    domain: 'Healthcare',
    url: 'https://physionet.org/content/ptb-xl/1.0.3/',
    description: '21,837 clinical 12-lead ECG records from 18,885 patients with gold-standard cardiologist annotations.',
    stars: 3800,
    author: 'PhysioNet'
  },
  {
    id: 'res-6',
    title: 'Decentralized Verifiable Credentials Implementation Guide',
    type: 'Documentation',
    projectId: 'proj-7',
    projectName: 'Decentralized Academic Credentials',
    domain: 'Blockchain',
    url: 'https://docs.polyverified.in',
    description: 'Technical reference for W3C Verifiable Credentials and EIP-712 typed signature verification.',
    author: 'IIIT Bangalore Web3 Lab'
  }
];
