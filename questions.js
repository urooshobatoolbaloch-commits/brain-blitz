// questions.js
// Questions dataset for "Brain Blitz"
// Microsoft Computer & English Language Institute, Khairpur Mirs
//
// FORMAT GUIDE:
// Each question is an object with:
// - subject: "computers" | "web" | "graphic" | "marketing" | "english" | "typing"
// - difficulty: "easy" | "medium" | "hard"
// - question: "Question prompt text"
// - options: Array of 4 string options
// - answer: Index (0, 1, 2, or 3) of the correct option in options array
// - explain: Brief one-line educational explanation shown after answering

const QUESTIONS_DATA = [
  // ==========================================
  // 1. COMPUTERS (16 Questions: 6 easy, 5 medium, 5 hard)
  // ==========================================
  {
    subject: "computers",
    difficulty: "easy",
    question: "What is known as the 'Brain' of the computer?",
    options: ["CPU", "RAM", "Hard Disk", "Monitor"],
    answer: 0,
    explain: "CPU (Central Processing Unit) performs all calculations and controls other parts."
  },
  {
    subject: "computers",
    difficulty: "easy",
    question: "Which keyboard shortcut is used to Copy selected text?",
    options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"],
    answer: 0,
    explain: "Ctrl + C copies text, while Ctrl + V pastes it into a document."
  },
  {
    subject: "computers",
    difficulty: "easy",
    question: "Which of these is an example of an Operating System?",
    options: ["Microsoft Windows", "Google Chrome", "MS Word", "Adobe Photoshop"],
    answer: 0,
    explain: "Windows is an Operating System that manages computer hardware and software."
  },
  {
    subject: "computers",
    difficulty: "easy",
    question: "Which device is primarily used to type text and numbers into a PC?",
    options: ["Keyboard", "Mouse", "Printer", "Speaker"],
    answer: 0,
    explain: "The keyboard is the primary text input device for computers."
  },
  {
    subject: "computers",
    difficulty: "easy",
    question: "In Microsoft Word, which shortcut makes selected text BOLD?",
    options: ["Ctrl + B", "Ctrl + I", "Ctrl + U", "Ctrl + S"],
    answer: 0,
    explain: "Ctrl + B toggles bold formatting for selected text."
  },
  {
    subject: "computers",
    difficulty: "easy",
    question: "What does RAM stand for in computer hardware?",
    options: ["Random Access Memory", "Read All Memory", "Rapid Action Module", "Run Auto Memory"],
    answer: 0,
    explain: "RAM is temporary high-speed memory used to store active programs and data."
  },
  {
    subject: "computers",
    difficulty: "medium",
    question: "In Microsoft Excel, what symbol must every formula begin with?",
    options: ["= (Equal sign)", "+ (Plus)", "@ (At sign)", "# (Hash)"],
    answer: 0,
    explain: "All formulas and functions in Excel start with an equal sign (=)."
  },
  {
    subject: "computers",
    difficulty: "medium",
    question: "Which shortcut undoes the last action on Windows?",
    options: ["Ctrl + Z", "Ctrl + Y", "Ctrl + U", "Ctrl + R"],
    answer: 0,
    explain: "Ctrl + Z is the universal shortcut to undo your recent action."
  },
  {
    subject: "computers",
    difficulty: "medium",
    question: "What does the 'S' in HTTPS stand for when browsing websites?",
    options: ["Secure", "Speed", "System", "Server"],
    answer: 0,
    explain: "HTTPS means Hypertext Transfer Protocol Secure, encrypting data between client and server."
  },
  {
    subject: "computers",
    difficulty: "medium",
    question: "Which file extension is commonly used for portable document files?",
    options: [".pdf", ".docx", ".xlsx", ".pptx"],
    answer: 0,
    explain: "PDF stands for Portable Document Format, created by Adobe."
  },
  {
    subject: "computers",
    difficulty: "medium",
    question: "Which storage device uses flash memory with no moving parts?",
    options: ["SSD (Solid State Drive)", "HDD (Hard Disk)", "CD-ROM", "Floppy Disk"],
    answer: 0,
    explain: "SSDs use flash chips, making them much faster and quieter than mechanical hard drives."
  },
  {
    subject: "computers",
    difficulty: "hard",
    question: "In Microsoft Excel, which function calculates the average of a range of numbers?",
    options: ["=AVERAGE()", "=MEAN()", "=SUMAVG()", "=CALC()"],
    answer: 0,
    explain: "=AVERAGE(A1:A10) returns the mathematical mean of selected cells."
  },
  {
    subject: "computers",
    difficulty: "hard",
    question: "What is a phishing attack in cybersecurity?",
    options: ["Deceptive emails or sites tricking you to give passwords", "A computer virus that deletes hard drives", "A hardware breakdown from overheating", "A slow internet connection"],
    answer: 0,
    explain: "Phishing uses fake messages or websites to steal sensitive personal credentials."
  },
  {
    subject: "computers",
    difficulty: "hard",
    question: "Which Windows shortcut locks your computer screen immediately?",
    options: ["Windows Key + L", "Windows Key + D", "Windows Key + E", "Windows Key + P"],
    answer: 0,
    explain: "Windows + L instantly locks your workstation for security."
  },
  {
    subject: "computers",
    difficulty: "hard",
    question: "What does 'URL' stand for in web terminology?",
    options: ["Uniform Resource Locator", "Universal Routing Link", "Unified Request Location", "Ultra Rapid Link"],
    answer: 0,
    explain: "A URL specifies the address of a unique web resource on the Internet."
  },
  {
    subject: "computers",
    difficulty: "hard",
    question: "In PowerPoint, which key starts a slide show from the first slide?",
    options: ["F5", "F1", "F11", "F12"],
    answer: 0,
    explain: "Pressing F5 starts the presentation from slide 1 (Shift+F5 starts from the current slide)."
  },

  // ==========================================
  // 2. WEB DESIGN (16 Questions: 6 easy, 5 medium, 5 hard)
  // ==========================================
  {
    subject: "web",
    difficulty: "easy",
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "High Tech Modern Language", "Hyperlinks Text Multi Layer", "Home Tool Markup Language"],
    answer: 0,
    explain: "HTML is the standard markup language used to structure web pages."
  },
  {
    subject: "web",
    difficulty: "easy",
    question: "Which technology is primarily used to style and color web pages?",
    options: ["CSS", "HTML", "SQL", "Python"],
    answer: 0,
    explain: "CSS (Cascading Style Sheets) controls colors, layout, fonts, and responsiveness."
  },
  {
    subject: "web",
    difficulty: "easy",
    question: "Which HTML tag is used to create a clickable hyperlink?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    answer: 0,
    explain: "The anchor tag <a> with an 'href' attribute creates hyperlinks."
  },
  {
    subject: "web",
    difficulty: "easy",
    question: "Which HTML tag is used to display an image on a webpage?",
    options: ["<img>", "<picture>", "<src>", "<image>"],
    answer: 0,
    explain: "The <img> tag embeds images using its 'src' attribute."
  },
  {
    subject: "web",
    difficulty: "easy",
    question: "Which HTML tag represents the largest heading by default?",
    options: ["<h1>", "<h6>", "<head>", "<header>"],
    answer: 0,
    explain: "<h1> is the top-level, largest heading, running down to <h6>."
  },
  {
    subject: "web",
    difficulty: "easy",
    question: "What is the primary role of JavaScript in web development?",
    options: ["Making web pages interactive and dynamic", "Designing database tables", "Setting up computer networks", "Formatting text fonts only"],
    answer: 0,
    explain: "JavaScript adds interactivity, animations, and dynamic logic to websites."
  },
  {
    subject: "web",
    difficulty: "medium",
    question: "In CSS, which property changes the text color of an element?",
    options: ["color", "text-color", "font-color", "background-color"],
    answer: 0,
    explain: "The 'color' property specifies the foreground color of text."
  },
  {
    subject: "web",
    difficulty: "medium",
    question: "What does 'responsive web design' mean?",
    options: ["Designing sites that adapt to all screen sizes", "Websites that load in under 1 second", "Websites that talk to the user", "Websites built only for mobile phones"],
    answer: 0,
    explain: "Responsive design ensures layouts adjust nicely to mobile phones, tablets, and desktops."
  },
  {
    subject: "web",
    difficulty: "medium",
    question: "In CSS Box Model, what is the space between the content and its border?",
    options: ["Padding", "Margin", "Outline", "Gap"],
    answer: 0,
    explain: "Padding is inner space inside the border; margin is outer space outside the border."
  },
  {
    subject: "web",
    difficulty: "medium",
    question: "Which CSS property is used to create a flexbox container?",
    options: ["display: flex;", "layout: flex;", "flex: container;", "align: flex;"],
    answer: 0,
    explain: "'display: flex;' activates flexible box layout for an element and its children."
  },
  {
    subject: "web",
    difficulty: "medium",
    question: "Which tag is used to create an unordered bulleted list in HTML?",
    options: ["<ul>", "<ol>", "<li>", "<list>"],
    answer: 0,
    explain: "<ul> creates an unordered bulleted list, containing <li> list items."
  },
  {
    subject: "web",
    difficulty: "hard",
    question: "In CSS, what is the default value of the 'position' property?",
    options: ["static", "relative", "absolute", "fixed"],
    answer: 0,
    explain: "Elements are positioned 'static' by default, following normal document flow."
  },
  {
    subject: "web",
    difficulty: "hard",
    question: "Which meta tag is essential for proper mobile scaling?",
    options: ['<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="mobile" content="yes">', '<meta name="screen" content="auto">', '<meta name="scale" content="100%">'],
    answer: 0,
    explain: "The viewport meta tag instructs mobile browsers to render at device width."
  },
  {
    subject: "web",
    difficulty: "hard",
    question: "What does DOM stand for in JavaScript web development?",
    options: ["Document Object Model", "Data Oriented Module", "Digital Operating Mode", "Dynamic Object Management"],
    answer: 0,
    explain: "The DOM represents the page structure as nodes that JavaScript can manipulate."
  },
  {
    subject: "web",
    difficulty: "hard",
    question: "Which CSS unit is relative to the font-size of the root element (<html>)?",
    options: ["rem", "em", "px", "%"],
    answer: 0,
    explain: "'rem' refers to Root EM, scaling consistently based on root font size."
  },
  {
    subject: "web",
    difficulty: "hard",
    question: "What is the purpose of semantic HTML tags like <nav>, <header>, and <article>?",
    options: ["Giving meaningful structure to browsers and screen readers", "Increasing website download speed", "Enabling JavaScript automatically", "Replacing CSS styling"],
    answer: 0,
    explain: "Semantic tags describe their meaning clearly to developers, search engines, and screen readers."
  },

  // ==========================================
  // 3. GRAPHIC DESIGN (16 Questions: 6 easy, 5 medium, 5 hard)
  // ==========================================
  {
    subject: "graphic",
    difficulty: "easy",
    question: "Which color model is primarily used for digital screens and monitors?",
    options: ["RGB (Red, Green, Blue)", "CMYK (Cyan, Magenta, Yellow, Black)", "Grayscale", "Pantone"],
    answer: 0,
    explain: "RGB produces light colors for screens; CMYK is used for commercial printing."
  },
  {
    subject: "graphic",
    difficulty: "easy",
    question: "Which color model is used for physical paper printing?",
    options: ["CMYK", "RGB", "HEX", "HSL"],
    answer: 0,
    explain: "CMYK (Cyan, Magenta, Yellow, Black) is the standard four-ink printing system."
  },
  {
    subject: "graphic",
    difficulty: "easy",
    question: "Which file format supports transparent backgrounds?",
    options: ["PNG", "JPEG", "BMP", "TXT"],
    answer: 0,
    explain: "PNG files support an alpha channel allowing semi-transparent and transparent backgrounds."
  },
  {
    subject: "graphic",
    difficulty: "easy",
    question: "What type of graphics can scale to any size without losing quality or becoming blurry?",
    options: ["Vector graphics (e.g. SVG)", "Raster graphics (e.g. JPEG)", "Bitmap graphics", "Pixel art"],
    answer: 0,
    explain: "Vectors use math formulas (paths, shapes), so they never pixelate when enlarged."
  },
  {
    subject: "graphic",
    difficulty: "easy",
    question: "What tool in Adobe Photoshop is used to pick an exact color from an image?",
    options: ["Eyedropper tool", "Lasso tool", "Eraser tool", "Magic Wand"],
    answer: 0,
    explain: "The Eyedropper tool samples colors directly from your image canvas."
  },
  {
    subject: "graphic",
    difficulty: "easy",
    question: "What is typography in graphic design?",
    options: ["The art and technique of arranging type and fonts", "Drawing pencil cartoons", "Taking high-speed photos", "Designing 3D animations"],
    answer: 0,
    explain: "Typography focuses on font choice, spacing, legibility, and text aesthetics."
  },
  {
    subject: "graphic",
    difficulty: "medium",
    question: "What is 'White Space' (or Negative Space) in a design layout?",
    options: ["Unmarked space between design elements giving visual breathing room", "An area that was accidentally deleted", "A white background only", "Space reserved for logos"],
    answer: 0,
    explain: "Negative space declutters layouts and guides the viewer's eyes to key elements."
  },
  {
    subject: "graphic",
    difficulty: "medium",
    question: "What is 'Kerning' in typography?",
    options: ["Adjusting the spacing between two specific characters", "Changing font color", "The line height between paragraphs", "Rotating letters 90 degrees"],
    answer: 0,
    explain: "Kerning adjusts the distance between individual letter pairs for visual harmony."
  },
  {
    subject: "graphic",
    difficulty: "medium",
    question: "What does DPI stand for in graphic resolution and printing?",
    options: ["Dots Per Inch", "Digital Picture Index", "Direct Print Image", "Data Pixel Interface"],
    answer: 0,
    explain: "DPI measures print resolution; 300 DPI is standard for high-quality printing."
  },
  {
    subject: "graphic",
    difficulty: "medium",
    question: "Which design principle helps guide the viewer's eye to the most important element first?",
    options: ["Visual Hierarchy", "Random Placement", "Color Inversion", "Symmetry only"],
    answer: 0,
    explain: "Visual hierarchy uses size, contrast, and weight to indicate importance."
  },
  {
    subject: "graphic",
    difficulty: "medium",
    question: "What are 'Complementary Colors' on the color wheel?",
    options: ["Colors located directly opposite each other", "Colors next to each other", "Different shades of one color", "Black and white only"],
    answer: 0,
    explain: "Complementary colors (like blue and orange) create high vibrant contrast."
  },
  {
    subject: "graphic",
    difficulty: "hard",
    question: "In Adobe Illustrator, what is the primary tool used to draw custom vector curves?",
    options: ["Pen Tool", "Brush Tool", "Crop Tool", "Blur Tool"],
    answer: 0,
    explain: "The Pen Tool creates precise vector anchor points and Bézier curves."
  },
  {
    subject: "graphic",
    difficulty: "hard",
    question: "What is 'Bleed' in print design preparation?",
    options: ["Artwork extending past the trim line to prevent white edges after cutting", "Ink smearing on paper", "Printing double-sided", "Color fading in sun"],
    answer: 0,
    explain: "Bleed ensures images reach the page edge after mechanical trimming (usually 3mm)."
  },
  {
    subject: "graphic",
    difficulty: "hard",
    question: "What is the difference between a Serif font and a Sans-Serif font?",
    options: ["Serif fonts have small decorative strokes on the ends of letters", "Sans-Serif fonts have decorative feet", "Serif fonts are always bold", "There is no difference"],
    answer: 0,
    explain: "'Sans' is French for 'without'; sans-serif fonts lack decorative strokes (feet)."
  },
  {
    subject: "graphic",
    difficulty: "hard",
    question: "In Adobe Photoshop, what does a 'Layer Mask' allow you to do non-destructively?",
    options: ["Hide or reveal portions of a layer without erasing pixels permanently", "Lock the layer permanently", "Convert layer to vector", "Duplicate the layer 10 times"],
    answer: 0,
    explain: "Masks use black (hide) and white (show) to edit visibility without losing pixel data."
  },
  {
    subject: "graphic",
    difficulty: "hard",
    question: "What is the 'Rule of Thirds' in visual composition?",
    options: ["Dividing a canvas into a 3x3 grid to place focal points along lines or intersections", "Using exactly three colors", "Using three different fonts", "Limiting text to 3 words"],
    answer: 0,
    explain: "The Rule of Thirds positions key subjects on grid intersections for balanced composition."
  },

  // ==========================================
  // 4. DIGITAL MARKETING (16 Questions: 6 easy, 5 medium, 5 hard)
  // ==========================================
  {
    subject: "marketing",
    difficulty: "easy",
    question: "What does 'SEO' stand for in digital marketing?",
    options: ["Search Engine Optimization", "Social Email Operation", "System Engine Organization", "Site Electronic Order"],
    answer: 0,
    explain: "SEO improves website visibility and rank on search engines like Google."
  },
  {
    subject: "marketing",
    difficulty: "easy",
    question: "Which platform is known for professional networking and business job hiring?",
    options: ["LinkedIn", "TikTok", "Snapchat", "Twitch"],
    answer: 0,
    explain: "LinkedIn connects professionals, companies, and job seekers worldwide."
  },
  {
    subject: "marketing",
    difficulty: "easy",
    question: "What is a 'Call to Action' (CTA) in an advertisement?",
    options: ["A button or prompt telling users what action to take (e.g. 'Sign Up Now')", "A phone call from the company", "A customer complaint message", "A legal disclaimer"],
    answer: 0,
    explain: "A CTA guides users toward a clear desired next step (like 'Buy Now' or 'Join Free')."
  },
  {
    subject: "marketing",
    difficulty: "easy",
    question: "What does 'PPC' stand for in online advertising?",
    options: ["Pay-Per-Click", "Post-Per-Channel", "Public-Product-Cost", "Paid-Promotion-Click"],
    answer: 0,
    explain: "In PPC ads, advertisers pay a fee each time a user clicks their ad."
  },
  {
    subject: "marketing",
    difficulty: "easy",
    question: "What is 'Email Marketing'?",
    options: ["Sending promotional or informational messages directly to email subscribers", "Hacking email accounts", "Writing personal letters to friends", "Posting videos on YouTube"],
    answer: 0,
    explain: "Email marketing nurtures customer relationships and promotes offers via targeted emails."
  },
  {
    subject: "marketing",
    difficulty: "easy",
    question: "Which of these is considered 'Organic' social media traffic?",
    options: ["Visitors who find your posts naturally without you paying for ads", "Visitors from paid Google Ads", "Sponsored influencer promotions", "Purchased bot followers"],
    answer: 0,
    explain: "Organic reach comes from unpaid, natural user engagement and sharing."
  },
  {
    subject: "marketing",
    difficulty: "medium",
    question: "What does 'CTR' stand for when analyzing advertising performance?",
    options: ["Click-Through Rate", "Customer Total Reach", "Content Traffic Ratio", "Channel Targeting Rate"],
    answer: 0,
    explain: "CTR is the percentage of people who saw an ad and clicked on it."
  },
  {
    subject: "marketing",
    difficulty: "medium",
    question: "What is the primary purpose of Google Analytics on a website?",
    options: ["Tracking visitor traffic, behavior, and conversions", "Creating graphics for banners", "Hosting the website files", "Writing blog articles automatically"],
    answer: 0,
    explain: "Google Analytics provides comprehensive metrics on visitor journeys and actions."
  },
  {
    subject: "marketing",
    difficulty: "medium",
    question: "What is a 'Target Audience' in marketing campaigns?",
    options: ["The specific group of people most likely to buy your product or service", "Every person on the internet", "The competitors in your industry", "Your company employees"],
    answer: 0,
    explain: "Identifying a target audience ensures marketing budgets focus on ideal customers."
  },
  {
    subject: "marketing",
    difficulty: "medium",
    question: "What is 'A/B Testing' (split testing) in digital marketing?",
    options: ["Comparing two versions of a page or ad to see which performs better", "Testing software for security bugs", "Grading student homework", "Translating ads into two languages"],
    answer: 0,
    explain: "A/B testing tests variant A against variant B to determine higher conversions."
  },
  {
    subject: "marketing",
    difficulty: "medium",
    question: "In SEO, what are 'Backlinks'?",
    options: ["Links from other external websites pointing back to your website", "Links going to your homepage only", "Broken 404 links", "Social media share buttons"],
    answer: 0,
    explain: "Quality backlinks signal credibility and authority to search engine ranking algorithms."
  },
  {
    subject: "marketing",
    difficulty: "hard",
    question: "What does 'ROI' stand for in marketing metrics?",
    options: ["Return on Investment", "Reach of Impression", "Rate of Interest", "Revenue on Internet"],
    answer: 0,
    explain: "ROI measures the profitability generated relative to the marketing expense."
  },
  {
    subject: "marketing",
    difficulty: "hard",
    question: "What is 'Remarketing' (or Retargeting)?",
    options: ["Showing ads to people who previously visited your website or interacted with your brand", "Changing your company logo", "Selling products in a new city", "Emailing random customer lists"],
    answer: 0,
    explain: "Retargeting re-engages warm visitors who didn't complete a purchase on their first visit."
  },
  {
    subject: "marketing",
    difficulty: "hard",
    question: "What is a 'Landing Page'?",
    options: ["A standalone web page created specifically for a marketing or advertising campaign", "The airport arrivals website", "The contact us page", "A web browser home tab"],
    answer: 0,
    explain: "Landing pages are tailored with a singular focus to convert visitors from specific campaigns."
  },
  {
    subject: "marketing",
    difficulty: "hard",
    question: "What is 'Influencer Marketing'?",
    options: ["Partnering with creators who have an engaged social following to promote products", "Hiring TV actors only", "Running newspaper classified ads", "Sending unsolicited text messages"],
    answer: 0,
    explain: "Brands leverage the trust and niche audience of social media creators."
  },
  {
    subject: "marketing",
    difficulty: "hard",
    question: "In SEO, what is the recommended optimal length for a webpage Title Tag?",
    options: ["50 to 60 characters", "10 to 15 characters", "150 to 200 characters", "500 characters"],
    answer: 0,
    explain: "Keeping titles under 60 characters prevents truncation on Google search result pages."
  },

  // ==========================================
  // 5. ENGLISH (16 Questions: 6 easy, 5 medium, 5 hard)
  // ==========================================
  {
    subject: "english",
    difficulty: "easy",
    question: "Choose the correct article: 'She ate ___ apple for breakfast.'",
    options: ["an", "a", "the only", "some"],
    answer: 0,
    explain: "Use 'an' before words beginning with a vowel sound (a, e, i, o, u)."
  },
  {
    subject: "english",
    difficulty: "easy",
    question: "What is the plural form of the word 'Child'?",
    options: ["Children", "Childs", "Childrens", "Childes"],
    answer: 0,
    explain: "'Child' is an irregular noun whose plural is 'children'."
  },
  {
    subject: "english",
    difficulty: "easy",
    question: "Which of these is the antonym (opposite) of the word 'Difficult'?",
    options: ["Easy", "Hard", "Tough", "Heavy"],
    answer: 0,
    explain: "'Easy' is the direct opposite of 'difficult'."
  },
  {
    subject: "english",
    difficulty: "easy",
    question: "Choose the correct past tense: 'Yesterday, Ali ___ to the institute.'",
    options: ["went", "go", "gone", "goes"],
    answer: 0,
    explain: "'Went' is the simple past tense form of 'go'."
  },
  {
    subject: "english",
    difficulty: "easy",
    question: "Which word is a noun in the sentence: 'The fast car drove away.'?",
    options: ["car", "fast", "drove", "away"],
    answer: 0,
    explain: "'Car' is a noun (thing); 'fast' is an adjective and 'drove' is a verb."
  },
  {
    subject: "english",
    difficulty: "easy",
    question: "What is the synonym (similar meaning) of the word 'Fast'?",
    options: ["Quick", "Slow", "Heavy", "Quiet"],
    answer: 0,
    explain: "'Quick' and 'fast' both mean moving with high speed."
  },
  {
    subject: "english",
    difficulty: "medium",
    question: "Choose the correct sentence with proper subject-verb agreement:",
    options: ["Neither the teacher nor the students were late.", "The list of items are on the desk.", "She don't know the answer.", "Everyone have submitted their work."],
    answer: 0,
    explain: "When using 'neither/nor', the verb agrees with the closer subject ('students were')."
  },
  {
    subject: "english",
    difficulty: "medium",
    question: "Choose the correct preposition: 'He has been studying ___ morning.'",
    options: ["since", "for", "from", "at"],
    answer: 0,
    explain: "Use 'since' with a specific starting point in time ('since morning')."
  },
  {
    subject: "english",
    difficulty: "medium",
    question: "What is the comparative form of the adjective 'Good'?",
    options: ["Better", "Gooder", "Best", "More good"],
    answer: 0,
    explain: "The degrees of comparison are: Good (positive), Better (comparative), Best (superlative)."
  },
  {
    subject: "english",
    difficulty: "medium",
    question: "Identify the conjunction in this sentence: 'I wanted to go, but it rained.'",
    options: ["but", "wanted", "to", "rained"],
    answer: 0,
    explain: "'But' is a coordinating conjunction connecting two independent clauses."
  },
  {
    subject: "english",
    difficulty: "medium",
    question: "Which word means 'able to speak two languages fluently'?",
    options: ["Bilingual", "Multilingual", "Monolingual", "Linguist"],
    answer: 0,
    explain: "'Bilingual' specifically refers to proficiency in two languages."
  },
  {
    subject: "english",
    difficulty: "hard",
    question: "Choose the correct spelling:",
    options: ["Accommodate", "Acommodate", "Accomodate", "Acomodate"],
    answer: 0,
    explain: "'Accommodate' has two 'c's and two 'm's."
  },
  {
    subject: "english",
    difficulty: "hard",
    question: "What does the idiom 'Piece of cake' mean?",
    options: ["Something very easy to do", "A delicious dessert", "A difficult puzzle", "A celebration gift"],
    answer: 0,
    explain: "Saying a task is a 'piece of cake' means it is effortless or very simple."
  },
  {
    subject: "english",
    difficulty: "hard",
    question: "Choose the sentence in Passive Voice:",
    options: ["The report was written by Sara.", "Sara wrote the report.", "Sara is writing the report.", "Sara will write the report."],
    answer: 0,
    explain: "In passive voice, the subject receives the action ('The report was written by...')."
  },
  {
    subject: "english",
    difficulty: "hard",
    question: "Choose the correct conditional sentence:",
    options: ["If you work hard, you will succeed.", "If you worked hard, you will succeed.", "If you work hard, you would succeeded.", "If you will work hard, you succeed."],
    answer: 0,
    explain: "First conditional rule: 'If + present simple, will + base verb'."
  },
  {
    subject: "english",
    difficulty: "hard",
    question: "What is an 'Oxymoron' in figures of speech?",
    options: ["Combining contradictory words together (e.g. 'deafening silence')", "Exaggerating facts wildly", "Comparing two things using 'like' or 'as'", "Giving human traits to animals"],
    answer: 0,
    explain: "An oxymoron juxtaposes contradictory terms like 'open secret' or 'deafening silence'."
  },

  // ==========================================
  // 6. TYPING & OFFICE (16 Questions: 6 easy, 5 medium, 5 hard)
  // ==========================================
  {
    subject: "typing",
    difficulty: "easy",
    question: "What are the Home Row keys for your left hand in touch typing?",
    options: ["A, S, D, F", "Q, W, E, R", "Z, X, C, V", "J, K, L, ;"],
    answer: 0,
    explain: "Left hand rests on A, S, D, F; right hand rests on J, K, L, ;."
  },
  {
    subject: "typing",
    difficulty: "easy",
    question: "What are the Home Row keys for your right hand in touch typing?",
    options: ["J, K, L, ;", "U, I, O, P", "M, N, B, V", "A, S, D, F"],
    answer: 0,
    explain: "Right index finger rests on J, middle on K, ring on L, pinky on ;."
  },
  {
    subject: "typing",
    difficulty: "easy",
    question: "Which keys typically have small tactile bumps or ridges to guide index fingers without looking?",
    options: ["F and J", "A and L", "G and H", "D and K"],
    answer: 0,
    explain: "Keys F and J have raised bumps so you can locate the Home Row by touch."
  },
  {
    subject: "typing",
    difficulty: "easy",
    question: "Which finger is primarily used to press the Spacebar?",
    options: ["Thumb", "Index finger", "Pinky finger", "Middle finger"],
    answer: 0,
    explain: "Either thumb rests comfortably over the Spacebar to type spaces."
  },
  {
    subject: "typing",
    difficulty: "easy",
    question: "What does 'WPM' stand for in typing tests?",
    options: ["Words Per Minute", "Work Per Month", "Wait Per Message", "Write Per Minute"],
    answer: 0,
    explain: "WPM measures typing speed, standardized at 5 characters per word."
  },
  {
    subject: "typing",
    difficulty: "easy",
    question: "Which key is used to start a new line or paragraph in a word processor?",
    options: ["Enter / Return", "Shift", "Tab", "Backspace"],
    answer: 0,
    explain: "The Enter (or Return) key inserts a line break or begins a new paragraph."
  },
  {
    subject: "typing",
    difficulty: "medium",
    question: "What is 'Touch Typing'?",
    options: ["Typing using muscle memory without looking down at the keyboard keys", "Typing on a smartphone touchscreen only", "Pressing keys with one finger only", "Using a digital stylus pen"],
    answer: 0,
    explain: "Touch typing relies on motor memory to hit keys accurately without looking down."
  },
  {
    subject: "typing",
    difficulty: "medium",
    question: "Which finger is responsible for pressing the Backspace key on a standard keyboard?",
    options: ["Right pinky finger", "Right thumb", "Left pinky finger", "Left index finger"],
    answer: 0,
    explain: "The right pinky reaches up to press Backspace and Enter."
  },
  {
    subject: "typing",
    difficulty: "medium",
    question: "What key is used to indent text or jump to the next input cell?",
    options: ["Tab", "Caps Lock", "Esc", "Ctrl"],
    answer: 0,
    explain: "The Tab key indents text and navigates between form fields or spreadsheet cells."
  },
  {
    subject: "typing",
    difficulty: "medium",
    question: "In Microsoft Office, which shortcut prints the current document?",
    options: ["Ctrl + P", "Ctrl + S", "Ctrl + O", "Ctrl + N"],
    answer: 0,
    explain: "Ctrl + P opens the print dialog menu across virtually all applications."
  },
  {
    subject: "typing",
    difficulty: "medium",
    question: "What is the standard character count considered as 'one word' in typing tests?",
    options: ["5 keystrokes (including spaces)", "10 keystrokes", "3 keystrokes", "7 keystrokes"],
    answer: 0,
    explain: "In standard typing benchmarks, 5 keystrokes (characters or spaces) count as one word."
  },
  {
    subject: "typing",
    difficulty: "hard",
    question: "What key combination opens the Windows Task Manager directly?",
    options: ["Ctrl + Shift + Esc", "Ctrl + Alt + T", "Ctrl + Shift + Del", "Alt + F4"],
    answer: 0,
    explain: "Ctrl + Shift + Esc directly opens Task Manager without an intermediate lock screen."
  },
  {
    subject: "typing",
    difficulty: "hard",
    question: "What is ergonomic typing posture to prevent wrist strain?",
    options: ["Wrists straight and elevated, elbows at 90 degrees, feet flat on the floor", "Resting wrists heavily on the desk edge while bending fingers backward", "Slouching forward close to screen", "Typing using only index fingers"],
    answer: 0,
    explain: "Proper neutral wrist position prevents repetitive strain injuries (RSI) and carpal tunnel."
  },
  {
    subject: "typing",
    difficulty: "hard",
    question: "What keyboard shortcut selects ALL content or text in a document or folder?",
    options: ["Ctrl + A", "Ctrl + S", "Ctrl + F", "Ctrl + E"],
    answer: 0,
    explain: "Ctrl + A ('All') selects all text or items in the current active window."
  },
  {
    subject: "typing",
    difficulty: "hard",
    question: "In Microsoft Word, what does pressing 'F7' do?",
    options: ["Runs Spelling and Grammar check", "Saves document", "Prints document", "Closes window"],
    answer: 0,
    explain: "F7 launches the Proofing / Spelling & Grammar checker in Microsoft Office."
  },
  {
    subject: "typing",
    difficulty: "hard",
    question: "Which typing layout is the world standard used on most computers and phones?",
    options: ["QWERTY", "DVORAK", "COLEMAK", "AZERTY"],
    answer: 0,
    explain: "QWERTY (named after its first six top letter keys) is the universal keyboard standard."
  }
];

// Helper: Get questions filtered by subject and/or difficulty
function getQuestionsByFilter(subject, difficulty) {
  return QUESTIONS_DATA.filter(q => {
    const matchSubject = !subject || subject === 'mix' || q.subject === subject;
    const matchDiff = !difficulty || q.difficulty === difficulty;
    return matchSubject && matchDiff;
  });
}
