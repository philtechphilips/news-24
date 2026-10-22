import type { Category, Comment, Podcast, Post, Writer } from "./types";

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  {
    slug: "economy",
    name: "Economy",
    description: "Markets, money and the forces shaping the global economy.",
    tagClass: "bg-brand text-white",
  },
  {
    slug: "style",
    name: "Style",
    description: "Fashion, trends and the culture of how we look and live.",
    tagClass: "bg-blue-600 text-white",
  },
  {
    slug: "art",
    name: "Art",
    description: "Artists, exhibitions and the stories behind creative work.",
    tagClass: "bg-green-600 text-white",
  },
  {
    slug: "world",
    name: "World News",
    description: "Reporting from around the globe on the stories that matter.",
    tagClass: "bg-ink text-white",
  },
  {
    slug: "technology",
    name: "Technology",
    description: "AI, security and the products changing how we work.",
    tagClass: "bg-indigo-600 text-white",
  },
  {
    slug: "sports",
    name: "Sports",
    description: "Results, records and the athletes behind them.",
    tagClass: "bg-orange-500 text-white",
  },
  {
    slug: "science",
    name: "Science",
    description: "Discoveries from labs, field work and research teams.",
    tagClass: "bg-teal-600 text-white",
  },
  {
    slug: "politics",
    name: "Politics",
    description: "Elections, policy and the people in power.",
    tagClass: "bg-slate-700 text-white",
  },
  {
    slug: "health",
    name: "Health",
    description: "Public health, medicine and living well.",
    tagClass: "bg-rose-500 text-white",
  },
  {
    slug: "entertainment",
    name: "Entertainment",
    description: "Film, television, music and the people who make them.",
    tagClass: "bg-purple-600 text-white",
  },
  {
    slug: "design",
    name: "Design",
    description: "Product design, UX and building things people love to use.",
    tagClass: "bg-amber-500 text-ink",
  },
];

export const writers: Writer[] = [
  {
    slug: "kristin-watson",
    name: "Kristin Watson",
    role: "Senior Writer",
    avatar: img("1573496359142-b8d87734a5a2", 800),
    location: "New York, USA",
    joined: "2019-03-04",
    bio: [
      "Kristin covers the global economy, from central bank decisions to the small businesses that feel them first. Before joining News 24 she spent six years on a markets desk, translating dense financial data into stories readers can act on.",
      "She is happiest with a spreadsheet open and a source on the phone, and believes every economic story is ultimately a story about people.",
    ],
    beats: ["Economy", "Markets", "Global trade"],
    social: { x: "https://x.com", linkedin: "https://linkedin.com" },
  },
  {
    slug: "marvin-roy",
    name: "Marvin Roy",
    role: "Journalist",
    avatar: img("1519085360753-af0119f7cbe7", 800),
    location: "London, UK",
    joined: "2020-08-17",
    bio: [
      "Marvin reports on world affairs and politics, with a focus on climate policy and international negotiations. He has covered summits on four continents and still keeps a notebook for every one.",
      "His reporting has been recognised for its clarity on complex policy fights, and he hosts the occasional live Q&A with readers.",
    ],
    beats: ["World News", "Politics", "Climate"],
    social: { x: "https://x.com", instagram: "https://instagram.com" },
  },
  {
    slug: "leslie-aria",
    name: "Leslie Aria",
    role: "Publisher",
    avatar: img("1580489944761-15a19d654956", 800),
    location: "Lagos, Nigeria",
    joined: "2018-01-09",
    bio: [
      "Leslie leads News 24's editorial direction and writes about art, culture and the creative economy. She founded the publication's arts desk and has commissioned hundreds of features from emerging writers.",
      "When she is not editing, she is visiting galleries and studios in search of the next story worth telling.",
    ],
    beats: ["Art", "Culture", "Creative economy"],
    social: {
      x: "https://x.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    slug: "hawkings-alex",
    name: "Hawkings Alex",
    role: "Content Writer",
    avatar: img("1507003211169-0a1dd7228f2d", 800),
    location: "Toronto, Canada",
    joined: "2021-05-22",
    bio: [
      "Hawkings writes about digital publishing, SEO and growing an audience online. He has helped dozens of independent blogs turn into sustainable businesses and shares what works, and what doesn't, in plain language.",
      "He also co-hosts the News 24 podcast on building a voice on the web.",
    ],
    beats: ["Blogging", "SEO", "Social media"],
    social: { x: "https://x.com", linkedin: "https://linkedin.com" },
  },
  {
    slug: "jenny-wilson",
    name: "Jenny Wilson",
    role: "Style Editor",
    avatar: img("1534528741775-53994a69daeb", 800),
    location: "Paris, France",
    joined: "2020-02-11",
    bio: [
      "Jenny edits the Style section, covering fashion weeks, independent designers and the business of what we wear.",
      "She is particularly interested in sustainable fashion and the makers rethinking how clothes are produced.",
    ],
    beats: ["Style", "Fashion", "Sustainability"],
    social: { instagram: "https://instagram.com" },
  },
  {
    slug: "daniel-okafor",
    name: "Daniel Okafor",
    role: "Tech Correspondent",
    avatar: img("1506794778202-cad84cf45f1d", 800),
    location: "San Francisco, USA",
    joined: "2022-04-03",
    bio: [
      "Daniel covers artificial intelligence, cybersecurity and the companies building the next generation of software.",
      "A former engineer, he likes to read the documentation before the press release.",
    ],
    beats: ["Technology", "AI", "Security"],
    social: { x: "https://x.com", linkedin: "https://linkedin.com" },
  },
  {
    slug: "amara-chen",
    name: "Amara Chen",
    role: "Design Writer",
    avatar: img("1544005313-94ddf0286df2", 800),
    location: "Singapore",
    joined: "2021-10-28",
    bio: [
      "Amara writes about product design, UX and design systems. She spent eight years designing apps used by millions before switching to writing about the craft full time.",
      "Her guides are known for being practical: every article ends with something you can try the same day.",
    ],
    beats: ["Design", "UX", "Design systems"],
    social: { x: "https://x.com", instagram: "https://instagram.com" },
  },
  {
    slug: "robert-fox",
    name: "Robert Fox",
    role: "Sports Reporter",
    avatar: img("1500648767791-00dcc994a43e", 800),
    location: "Melbourne, Australia",
    joined: "2019-11-15",
    bio: [
      "Robert covers athletics, football and the science of performance. He has reported from three Olympic Games and countless muddy touchlines.",
      "He also writes about health and fitness for everyday athletes.",
    ],
    beats: ["Sports", "Athletics", "Health"],
    social: { x: "https://x.com" },
  },
];

export const posts: Post[] = [
  {
    slug: "markets-money-and-global-economies",
    title: "Exploring the Intricacies of Markets, Money, and Global Economies",
    excerpt:
      "Interest rates, supply chains and a shifting balance of trade are reshaping how money moves around the world. Here is what it means for you.",
    image: img("1477959858617-67f85cf4f1df"),
    imageAlt: "Aerial view of a dense city skyline by the water",
    category: "economy",
    writer: "kristin-watson",
    date: "2026-10-21",
    views: 18420,
    likes: 342,
    featured: true,
    body: [
      {
        type: "p",
        text: "The global economy rarely moves in a straight line, but the past year has been unusually tangled. Central banks have tried to cool inflation without stalling growth, supply chains have been redrawn, and currencies have swung on every new data release.",
      },
      {
        type: "p",
        text: "For households, the effects show up in mortgage payments, grocery bills and job listings. For businesses, they show up in the cost of borrowing and the price of every part they import.",
      },
      { type: "h2", text: "Why interest rates still matter most" },
      {
        type: "p",
        text: "Interest rates are the lever central banks pull to speed up or slow down an economy. When rates rise, borrowing becomes more expensive, spending slows and, eventually, prices stop climbing as fast. When rates fall, the opposite happens.",
      },
      {
        type: "quote",
        text: "Every rate decision is a bet on where the economy will be in eighteen months, not where it is today.",
        cite: "A former central bank economist",
      },
      { type: "h2", text: "Trade is being rewired" },
      {
        type: "p",
        text: "Companies that once chased the lowest cost are now paying for resilience. Factories are moving closer to customers, and suppliers are being split across several countries so that a single disruption cannot stop production.",
      },
      {
        type: "list",
        items: [
          "Nearshoring is bringing manufacturing closer to major markets.",
          "Companies are holding larger inventories as a buffer.",
          "New trade agreements are focusing on critical minerals and energy.",
        ],
      },
      {
        type: "p",
        text: "None of this happens overnight, but together these shifts will shape prices, wages and opportunities for years to come.",
      },
    ],
  },
  {
    slug: "journey-through-colors-textures-and-trends",
    title: "A Journey Through Colors, Textures, and Trends",
    excerpt:
      "This season's collections trade minimalism for rich texture and bold colour. We look at the designers leading the change.",
    image: img("1490481651871-ab68de25d43d"),
    imageAlt: "Neutral-toned clothes hanging on a rail",
    category: "style",
    writer: "jenny-wilson",
    date: "2026-10-20",
    views: 9310,
    likes: 211,
    featured: true,
    body: [
      {
        type: "p",
        text: "After years of quiet neutrals, fashion is getting louder. Runways this season were full of saturated colour, layered fabrics and pieces that ask to be touched.",
      },
      { type: "h2", text: "Texture is the new statement" },
      {
        type: "p",
        text: "Bouclé, crushed velvet and hand-finished knits appeared across collections. Designers say texture gives a garment personality without relying on logos.",
      },
      {
        type: "quote",
        text: "People want clothes that feel like something, not just clothes that look like something in a photo.",
        cite: "An independent designer in Paris",
      },
      { type: "h2", text: "Colour with intention" },
      {
        type: "p",
        text: "Instead of head-to-toe brights, stylists are pairing one strong colour with natural tones. Deep reds, cobalt and olive green were the standouts.",
      },
      {
        type: "list",
        items: [
          "Pair a textured jacket with simple basics.",
          "Choose one bold colour and let it lead.",
          "Invest in natural fabrics that age well.",
        ],
      },
    ],
  },
  {
    slug: "inspiring-creativity-and-artistic-expression",
    title: "Inspiring Creativity and Fostering Artistic Expression",
    excerpt:
      "Community studios are opening their doors to first-time artists. Their founders explain why creativity belongs to everyone.",
    image: img("1579783902614-a3fb3927b6a5"),
    imageAlt: "Classical still-life painting of flowers in a vase",
    category: "art",
    writer: "leslie-aria",
    date: "2026-10-19",
    views: 7640,
    likes: 188,
    featured: true,
    body: [
      {
        type: "p",
        text: "In a converted warehouse, a retired nurse is learning to paint for the first time, next to a teenager working on her portfolio. Community studios like this one are spreading in cities around the world.",
      },
      { type: "h2", text: "Making art accessible" },
      {
        type: "p",
        text: "The idea is simple: provide space, materials and a little guidance, and let people make things. Most studios charge on a sliding scale or not at all.",
      },
      {
        type: "quote",
        text: "Nobody walks in thinking they are an artist. Most of them walk out thinking they might be.",
        cite: "A studio founder",
      },
      {
        type: "p",
        text: "Research backs up what studio founders see every week: regular creative practice is linked to lower stress, stronger social ties and greater confidence.",
      },
      { type: "h2", text: "How to get started" },
      {
        type: "list",
        items: [
          "Look for open studio nights at local galleries and libraries.",
          "Start small with a sketchbook and ten minutes a day.",
          "Share your work with a friend; feedback builds momentum.",
        ],
      },
    ],
  },
  {
    slug: "global-leaders-unite-on-climate-crisis",
    title: "Global leaders unite to address climate crisis at COP26",
    excerpt:
      "Amid escalating tensions and humanitarian crises in various conflict hotspots around the world, leaders convened to address the climate emergency.",
    image: img("1466611653911-95081537e5b7"),
    imageAlt: "Wind turbines silhouetted against a sunset",
    category: "world",
    writer: "marvin-roy",
    date: "2026-10-18",
    views: 15230,
    likes: 276,
    body: [
      {
        type: "p",
        text: "Delegates from nearly 200 countries gathered this week for climate talks that many described as a last chance to keep warming within safe limits.",
      },
      {
        type: "p",
        text: "Negotiations focused on three areas: faster cuts to emissions, money for countries already facing climate damage, and a timeline for phasing down coal.",
      },
      { type: "h2", text: "What was agreed" },
      {
        type: "list",
        items: [
          "New national targets for cutting emissions by 2035.",
          "An expanded fund to help vulnerable countries adapt.",
          "Commitments to cut methane from oil and gas production.",
        ],
      },
      {
        type: "quote",
        text: "The agreements are a floor, not a ceiling. What matters now is delivery.",
        cite: "A negotiator for a small island nation",
      },
      {
        type: "p",
        text: "Campaigners welcomed the progress but warned that pledges have fallen short before. The next review of national plans is due in two years.",
      },
    ],
  },
  {
    slug: "cybersecurity-experts-warn-of-increased-threats",
    title: "Cybersecurity experts warn of increased threats",
    excerpt:
      "This warning serves as a stark reminder of the critical imperative to bolster cybersecurity frameworks and stay vigilant against attacks.",
    image: img("1550751827-4bd374c3f58b"),
    imageAlt: "Illuminated circuit pattern on a dark background",
    category: "technology",
    writer: "daniel-okafor",
    date: "2026-10-17",
    views: 12980,
    likes: 231,
    body: [
      {
        type: "p",
        text: "Security researchers are reporting a sharp rise in attacks on businesses of every size, from ransomware gangs to highly targeted phishing campaigns.",
      },
      { type: "h2", text: "Smaller companies are in the firing line" },
      {
        type: "p",
        text: "Attackers increasingly target smaller firms, which often lack dedicated security teams but hold valuable data or provide access to larger partners.",
      },
      {
        type: "quote",
        text: "Most breaches still start with a single click on a convincing email.",
        cite: "A security analyst",
      },
      { type: "h2", text: "Simple steps that help" },
      {
        type: "list",
        items: [
          "Turn on multi-factor authentication for every account.",
          "Keep software and devices updated.",
          "Back up important data and test that you can restore it.",
          "Train staff to recognise phishing attempts.",
        ],
      },
    ],
  },
  {
    slug: "athlete-achieves-historic-win-at-world-championships",
    title: "Athlete achieves historic win at world championships",
    excerpt:
      "This landmark achievement not only signifies exceptional prowess and dedication but also stands as a testament to years of work.",
    image: img("1461896836934-ffe607ba8211"),
    imageAlt: "Sprinter in the starting blocks on a running track",
    category: "sports",
    writer: "robert-fox",
    date: "2026-10-16",
    views: 11040,
    likes: 305,
    body: [
      {
        type: "p",
        text: "In front of a packed stadium, a 22-year-old sprinter crossed the line first to claim a championship title that has eluded their country for half a century.",
      },
      {
        type: "p",
        text: "The win capped a remarkable season that began with an injury and ended with a personal best in the final.",
      },
      { type: "h2", text: "Years in the making" },
      {
        type: "p",
        text: "Coaches point to a patient training plan, a focus on recovery and a support team that included sports scientists, nutritionists and psychologists.",
      },
      {
        type: "quote",
        text: "I've dreamed about this race since I was ten. Tonight it finally felt real.",
        cite: "The new world champion",
      },
    ],
  },
  {
    slug: "chemical-currents-breaking-news-in-chemistry",
    title: "Chemical currents breaking news in chemistry and materials science",
    excerpt:
      "From unveiling novel compounds and catalysts to pioneering advances in nanotechnology and biomaterials, the breaking news in the lab.",
    image: img("1532094349884-543bc11b234d"),
    imageAlt: "Glass laboratory flasks on a white bench",
    category: "science",
    writer: "daniel-okafor",
    date: "2026-10-15",
    views: 6120,
    likes: 97,
    body: [
      {
        type: "p",
        text: "Materials scientists have had a busy year. New catalysts promise cheaper clean fuels, and a family of lightweight materials could make batteries safer.",
      },
      { type: "h2", text: "Highlights from the lab" },
      {
        type: "list",
        items: [
          "A catalyst that splits water using far less precious metal.",
          "Biodegradable plastics made from agricultural waste.",
          "Solid-state electrolytes that reduce battery fire risk.",
        ],
      },
      {
        type: "p",
        text: "Many of these breakthroughs are still years from products, but researchers say the pace of discovery is accelerating thanks to automated labs and machine learning.",
      },
    ],
  },
  {
    slug: "tech-giants-unveil-next-generation-ai-assistants",
    title: "Tech giants unveil plans for next generation AI assistants",
    excerpt:
      "The biggest names in technology showed off assistants that can plan, write and take action on your behalf.",
    image: img("1677442136019-21780ecad995"),
    imageAlt: "Large blue 3D letters spelling AI",
    category: "technology",
    writer: "daniel-okafor",
    date: "2026-10-21",
    views: 21400,
    likes: 412,
    trending: true,
    body: [
      {
        type: "p",
        text: "AI assistants are moving beyond answering questions. The latest announcements promise tools that book travel, manage inboxes and write code with little supervision.",
      },
      { type: "h2", text: "What's new" },
      {
        type: "p",
        text: "The new assistants can work across apps, remember preferences and break large tasks into steps. Companies say safeguards will ask for confirmation before anything important happens.",
      },
      {
        type: "quote",
        text: "The question is no longer whether these tools are useful, but how much we are willing to let them do.",
        cite: "A technology researcher",
      },
      {
        type: "p",
        text: "Privacy advocates are calling for clear rules on what data assistants can access and how long it is kept.",
      },
    ],
  },
  {
    slug: "government-faces-backlash-over-tax-reform",
    title: "Government faces backlash over proposed tax reform legislation",
    excerpt:
      "A proposed overhaul of income and property taxes has drawn criticism from business groups and unions alike.",
    image: img("1554224155-6726b3ff858f"),
    imageAlt: "Tax forms, a calculator and a pen on a desk",
    category: "politics",
    writer: "marvin-roy",
    date: "2026-10-20",
    views: 9870,
    likes: 143,
    trending: true,
    body: [
      {
        type: "p",
        text: "The government's tax reform bill was meant to simplify the system. Instead it has united critics from very different corners.",
      },
      {
        type: "p",
        text: "Business groups say changes to deductions will raise costs, while unions argue that the new brackets favour higher earners.",
      },
      { type: "h2", text: "What happens next" },
      {
        type: "p",
        text: "The bill goes to committee next month, where amendments are expected. Ministers say they are open to changes but insist the core reforms will stay.",
      },
    ],
  },
  {
    slug: "community-health-campaign-childhood-obesity",
    title: "Community health initiative launches campaign to combat childhood obesity",
    excerpt:
      "Schools, clinics and local sports clubs are joining forces on a campaign to help children stay active and eat well.",
    image: img("1505751172876-fa1923c5c528"),
    imageAlt: "Stethoscope resting on a white surface",
    category: "health",
    writer: "robert-fox",
    date: "2026-10-19",
    views: 5430,
    likes: 88,
    trending: true,
    body: [
      {
        type: "p",
        text: "A new community campaign aims to make healthy habits easier for families, with free after-school sports, cooking classes and check-ups.",
      },
      {
        type: "list",
        items: [
          "Free sports sessions three afternoons a week.",
          "Family cooking classes at community centres.",
          "Healthier menus in participating school canteens.",
        ],
      },
      {
        type: "p",
        text: "Organisers say the focus is on fun and access rather than weight, and that early results from pilot schools are encouraging.",
      },
    ],
  },
  {
    slug: "candidates-gear-up-for-contested-race",
    title: "Candidates gear up for highly contested race",
    excerpt:
      "With polls neck and neck, campaigns are focusing on turnout and a handful of undecided districts.",
    image: img("1495020689067-958852a7765e"),
    imageAlt: "Person reading a newspaper on a bench",
    category: "politics",
    writer: "marvin-roy",
    date: "2026-10-18",
    views: 8760,
    likes: 120,
    trending: true,
    body: [
      {
        type: "p",
        text: "With weeks to go before voting day, the race remains too close to call. Both campaigns are pouring resources into a few districts where undecided voters could decide the outcome.",
      },
      { type: "h2", text: "The issues voters care about" },
      {
        type: "list",
        items: ["Cost of living", "Housing", "Healthcare", "Jobs"],
      },
      {
        type: "p",
        text: "Televised debates next week are expected to be decisive, and turnout operations are already in full swing.",
      },
    ],
  },
  {
    slug: "entertainment-industry-mourns-iconic-actor",
    title: "Entertainment industry mourns loss of iconic actor",
    excerpt:
      "Tributes poured in from colleagues and fans for a performer whose career spanned five decades.",
    image: img("1489599849927-2ee91cede3ba"),
    imageAlt: "Empty red cinema seats in a dark theatre",
    category: "entertainment",
    writer: "leslie-aria",
    date: "2026-10-17",
    views: 13200,
    likes: 520,
    trending: true,
    body: [
      {
        type: "p",
        text: "Film and theatre colleagues remembered a performer known for generosity on set and unforgettable roles on screen.",
      },
      {
        type: "p",
        text: "Cinemas in several cities have announced retrospective screenings, and a public memorial is planned for next month.",
      },
      {
        type: "quote",
        text: "They made every scene partner better. That was their real gift.",
        cite: "A longtime co-star",
      },
    ],
  },
  {
    slug: "build-a-scalable-design-system-from-scratch",
    title: "How to build a scalable design system from scratch",
    excerpt:
      "Start small, document as you go and treat your design system like a product. A practical guide for growing teams.",
    image: img("1561070791-2526d30994b5"),
    imageAlt: "Colour swatches and design sketches on a table",
    category: "design",
    writer: "amara-chen",
    date: "2026-10-10",
    views: 24800,
    likes: 618,
    body: [
      {
        type: "p",
        text: "A design system is a shared set of decisions: colours, type, spacing and components that every designer and developer can rely on. Done well, it makes teams faster and products more consistent.",
      },
      { type: "h2", text: "Start with tokens" },
      {
        type: "p",
        text: "Tokens are named values such as colour-brand or space-4. They are the smallest building blocks and the easiest to share between design tools and code.",
      },
      { type: "h2", text: "Build the components you actually use" },
      {
        type: "p",
        text: "Audit your product and start with the components that appear most often: buttons, inputs, cards. Resist the urge to design for every possible future need.",
      },
      {
        type: "list",
        items: [
          "Define tokens for colour, type, spacing and radius.",
          "Build five core components and document them.",
          "Publish a changelog so teams know what changed.",
          "Assign owners and a regular review cadence.",
        ],
      },
      {
        type: "quote",
        text: "A design system isn't a project, it's a product serving products.",
        cite: "Nathan Curtis",
      },
    ],
  },
  {
    slug: "balancing-creativity-and-user-experience",
    title: "The art of balancing creativity and user experience in design",
    excerpt:
      "Bold ideas make products memorable, but clarity makes them usable. Here's how to have both.",
    image: img("1541701494587-cb58502866ab"),
    imageAlt: "Swirls of colourful ink in water",
    category: "design",
    writer: "amara-chen",
    date: "2026-10-10",
    views: 19300,
    likes: 455,
    body: [
      {
        type: "p",
        text: "Every designer has felt the tension between doing something new and doing something people instantly understand. The best work finds room for both.",
      },
      { type: "h2", text: "Be conventional where it counts" },
      {
        type: "p",
        text: "Navigation, forms and checkout flows benefit from familiarity. Save your creative energy for moments that define your brand: onboarding, empty states and illustrations.",
      },
      {
        type: "list",
        items: [
          "Test bold ideas with five users before shipping.",
          "Keep primary actions obvious and consistent.",
          "Use motion to guide attention, not to decorate.",
        ],
      },
    ],
  },
  {
    slug: "science-behind-effective-call-to-action-buttons",
    title: "The science behind effective call-to-action buttons",
    excerpt:
      "Colour, copy and placement all affect whether people click. What the research says about buttons that convert.",
    image: img("1547658719-da2b51169166"),
    imageAlt: "Desk with a monitor, tablet and phone showing a website",
    category: "design",
    writer: "amara-chen",
    date: "2026-10-10",
    views: 16700,
    likes: 389,
    body: [
      {
        type: "p",
        text: "A call-to-action button has one job: to make the next step obvious. Small details can make a big difference to how well it does that job.",
      },
      { type: "h2", text: "Write the outcome, not the action" },
      {
        type: "p",
        text: "'Start my free trial' tends to outperform 'Submit' because it tells people what they get. Specific, first-person copy reduces hesitation.",
      },
      { type: "h2", text: "Contrast beats colour" },
      {
        type: "p",
        text: "There is no magic button colour. What matters is that the button stands out from everything around it and is large enough to tap comfortably.",
      },
    ],
  },
  {
    slug: "must-have-features-for-a-modern-portfolio",
    title: "10 must-have features for a modern portfolio website",
    excerpt:
      "From case studies to fast load times, the features that help your portfolio stand out to clients and hiring managers.",
    image: img("1558655146-9f40138edfeb"),
    imageAlt: "Hands using a stylus on a tablet next to a keyboard",
    category: "design",
    writer: "hawkings-alex",
    date: "2026-10-10",
    views: 14100,
    likes: 302,
    body: [
      {
        type: "p",
        text: "Your portfolio is often the first impression you make. These are the features that consistently help designers and developers get noticed.",
      },
      {
        type: "list",
        items: [
          "A clear one-line introduction",
          "Three to five in-depth case studies",
          "Your process, not just final screens",
          "Measurable results where possible",
          "Fast load times",
          "Mobile-friendly layouts",
          "An easy way to contact you",
          "Testimonials from clients or colleagues",
          "A short about page with a photo",
          "Links to your writing or talks",
        ],
      },
      {
        type: "p",
        text: "Above all, keep it current. A portfolio with three great recent projects beats one with twenty old ones.",
      },
    ],
  },
  {
    slug: "create-a-seamless-user-journey",
    title: "How to create a seamless user journey on your website",
    excerpt:
      "Map the path your visitors take, remove the friction and guide them to what they came for.",
    image: img("1552664730-d307ca884978"),
    imageAlt: "Team planning with sticky notes on a whiteboard",
    category: "design",
    writer: "hawkings-alex",
    date: "2026-10-10",
    views: 12650,
    likes: 254,
    body: [
      {
        type: "p",
        text: "A user journey is every step someone takes from discovering your site to reaching their goal. Mapping it reveals where people get stuck.",
      },
      { type: "h2", text: "Map it with real data" },
      {
        type: "p",
        text: "Combine analytics with a handful of user interviews. Numbers tell you where people drop off; conversations tell you why.",
      },
      {
        type: "list",
        items: [
          "Identify your top three user goals.",
          "Walk through each journey yourself on mobile.",
          "Remove one unnecessary step from each.",
        ],
      },
    ],
  },
  {
    slug: "why-mobile-first-design-is-no-longer-optional",
    title: "Why mobile-first design is no longer optional",
    excerpt:
      "Most of your visitors arrive on a phone. Designing for small screens first leads to better products everywhere.",
    image: img("1432888498266-38ffec3eaf0a"),
    imageAlt: "Phone, wireframe sketches and stationery on a desk",
    category: "design",
    writer: "amara-chen",
    date: "2026-10-10",
    views: 15890,
    likes: 347,
    body: [
      {
        type: "p",
        text: "More than half of web traffic now comes from phones. Starting with the smallest screen forces you to prioritise what really matters.",
      },
      { type: "h2", text: "Constraints create clarity" },
      {
        type: "p",
        text: "With limited space, every element must earn its place. The result is usually a simpler, faster experience that scales up gracefully to larger screens.",
      },
      {
        type: "list",
        items: [
          "Design for thumbs: keep key actions within reach.",
          "Use readable text sizes without zooming.",
          "Optimise images and keep pages light.",
        ],
      },
    ],
  },
];

export const podcasts: Podcast[] = [
  {
    slug: "social-media-power",
    title: "Social Media Power: Amplifying Your Blog's Reach",
    description:
      "Learn how to leverage social media platforms to increase blog traffic and engagement.",
    image: img("1593642632559-0c6d3fc62b89"),
    imageAlt: "Laptop on a bright desk by a window",
    host: "hawkings-alex",
    date: "2026-10-14",
    duration: "38 min",
    topics: ["Social media", "Audience growth", "Content strategy"],
    notes: [
      "Choosing the two platforms that matter for your audience.",
      "Turning one article into a week of social posts.",
      "How to measure what's actually driving readers.",
    ],
  },
  {
    slug: "seo-mastery",
    title: "SEO Mastery: How to Rank Higher on Google",
    description:
      "Get expert SEO tips to improve your blog's visibility and ranking.",
    image: img("1460925895917-afdab827c52f"),
    imageAlt: "Laptop showing an analytics dashboard",
    host: "hawkings-alex",
    date: "2026-10-07",
    duration: "45 min",
    topics: ["SEO", "Keywords", "Analytics"],
    notes: [
      "Finding keywords your readers actually search for.",
      "Writing titles and descriptions that earn the click.",
      "Technical basics: speed, structure and internal links.",
    ],
  },
  {
    slug: "monetizing-your-blog",
    title: "Monetizing Your Blog: Turning Passion Into Profit",
    description:
      "Explore top strategies for making money from your blog.",
    image: img("1590602847861-f357a9332bbc"),
    imageAlt: "Studio microphone on a boom arm",
    host: "kristin-watson",
    date: "2026-09-30",
    duration: "41 min",
    topics: ["Monetization", "Newsletters", "Sponsorships"],
    notes: [
      "Ads, affiliates, memberships: which model fits your blog.",
      "Pricing your first sponsorship.",
      "Building a newsletter readers will pay for.",
    ],
  },
  {
    slug: "inside-the-newsroom",
    title: "Inside the Newsroom: How a Story Gets Made",
    description:
      "From the first tip to publication, our editors walk through the life of a story.",
    image: img("1478737270239-2f02b77fc618"),
    imageAlt: "Microphone in a dimly lit recording studio",
    host: "leslie-aria",
    date: "2026-09-23",
    duration: "52 min",
    topics: ["Journalism", "Editing", "Fact-checking"],
    notes: [
      "How editors decide which stories to pursue.",
      "Verifying sources and checking facts.",
      "The final read before a story goes live.",
    ],
  },
  {
    slug: "design-for-everyone",
    title: "Design for Everyone: Accessibility in Practice",
    description:
      "Practical ways to make websites and apps work for every reader.",
    image: img("1557672172-298e090bd0f1"),
    imageAlt: "Abstract pink and blue fluid paint",
    host: "amara-chen",
    date: "2026-09-16",
    duration: "36 min",
    topics: ["Accessibility", "UX", "Inclusive design"],
    notes: [
      "Colour contrast and readable type.",
      "Designing for keyboard and screen reader users.",
      "Testing accessibility without special tools.",
    ],
  },
  {
    slug: "future-of-work-with-ai",
    title: "The Future of Work with AI",
    description:
      "What AI assistants will change about our jobs, and what they won't.",
    image: img("1485827404703-89b55fcc595e"),
    imageAlt: "Small white humanoid robot",
    host: "daniel-okafor",
    date: "2026-09-09",
    duration: "47 min",
    topics: ["AI", "Careers", "Productivity"],
    notes: [
      "Which tasks AI handles well today.",
      "Skills that become more valuable, not less.",
      "How teams are adopting AI responsibly.",
    ],
  },
];

/** Sample comments every visitor sees; comments people add are kept in their browser. */
export const seedComments: Record<string, Comment[]> = {
  "markets-money-and-global-economies": [
    {
      id: "seed-1",
      parentId: null,
      author: "Tunde Bakare",
      body: "Really clear explanation of how rate decisions filter down to households. The point about eighteen-month bets stuck with me.",
      date: "2026-10-21",
      likes: 14,
    },
    {
      id: "seed-2",
      parentId: "seed-1",
      author: "Grace Lin",
      body: "Same here. I'd love a follow-up on what this means for first-time home buyers.",
      date: "2026-10-21",
      likes: 6,
    },
    {
      id: "seed-3",
      parentId: null,
      author: "Samuel Ortiz",
      body: "Nearshoring is already visible where I work. Two of our suppliers moved production closer this year.",
      date: "2026-10-22",
      likes: 3,
    },
  ],
  "build-a-scalable-design-system-from-scratch": [
    {
      id: "seed-4",
      parentId: null,
      author: "Priya Nair",
      body: "Starting with tokens saved our team months. Great advice on not over-designing for the future.",
      date: "2026-10-11",
      likes: 22,
    },
    {
      id: "seed-5",
      parentId: "seed-4",
      author: "Leo Martins",
      body: "Did you sync tokens to code automatically or by hand at first?",
      date: "2026-10-12",
      likes: 4,
    },
    {
      id: "seed-6",
      parentId: "seed-5",
      author: "Priya Nair",
      body: "By hand for the first few weeks, then we automated it once the names settled down.",
      date: "2026-10-12",
      likes: 7,
    },
  ],
  "tech-giants-unveil-next-generation-ai-assistants": [
    {
      id: "seed-7",
      parentId: null,
      author: "Hannah Reid",
      body: "The confirmation step before important actions is the part I care about most. Good to see it mentioned.",
      date: "2026-10-21",
      likes: 9,
    },
  ],
};
