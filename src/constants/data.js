// ── Family Devotion Topics ────────────────────────────────────────────────────
export const TOPICS = [
  // Marriage & Partnership
  "Loving your spouse unconditionally", "Communication in marriage", "Conflict resolution in marriage",
  "Keeping romance alive", "Forgiveness in marriage", "Spiritual intimacy with your spouse",
  "When marriage feels hard", "Building trust after hurt", "Serving your partner sacrificially",
  "Praying together as a couple",

  // Parenting
  "Patience as a parent", "Discipline with grace", "Raising children in faith",
  "When your child is struggling", "Being present in a distracted world", "Letting go and trusting God with your children",
  "Parenting through fear and worry", "Modeling humility for your kids", "Speaking life over your children",
  "Teaching your children to pray",

  // Parenting Teenagers
  "When your teenager pulls away", "Staying connected through rebellion", "Trusting God with your prodigal",
  "Setting boundaries with love", "Navigating peer pressure together", "Conversations about faith with teens",

  // Blended & Extended Family
  "Navigating blended family life", "Honoring your parents as an adult", "Difficult in-law relationships",
  "Loving step-children well", "Co-parenting with grace", "When family wounds run deep",
  "Reconciling fractured family bonds", "Choosing unity over being right",

  // Family Seasons
  "New baby and new beginnings", "Empty nest and letting go", "Grief and loss in the family",
  "Financial stress and family peace", "Moving and family transition", "Seasons of family change",
  "Work-life balance as a parent", "Rest and Sabbath for the family",

  // Faith & Identity in Family
  "Building a legacy of faith", "Family prayer rhythms", "Passing faith to the next generation",
  "When faith looks different in your family", "Finding purpose in your family role",
  "God's design for the family", "Imperfect families used by God",

  // Character & Virtue at Home
  "Humility in the home", "Gratitude as a family practice", "Joy when home life is hard",
  "Anger and self-control at home", "Grace for imperfect family members", "Forgiving family deeply",
  "Kindness as the culture of your home", "Guarding your heart as a spouse",
];

// ── Devotion Perspectives ─────────────────────────────────────────────────────
export const DEVOTION_PERSPECTIVES = [
  { id: "parent",   label: "For Parents",       sub: "Guidance for you as the parent",           icon: "🙏" },
  { id: "child",    label: "For My Child",       sub: "Nurtures & speaks directly to your child", icon: "🌱" },
  { id: "together", label: "Together",           sub: "Read aloud as a family",                   icon: "👨‍👩‍👧" },
  { id: "couple",   label: "For Couples",        sub: "Devotion for husband & wife",              icon: "💍" },
];

// ── Age Ranges ────────────────────────────────────────────────────────────────
export const AGE_RANGES = [
  { id: "toddler",    label: "Little Ones",   sub: "Ages 0–5"  },
  { id: "elementary", label: "Elementary",    sub: "Ages 6–11" },
  { id: "teen",       label: "Teens",         sub: "Ages 12–17" },
  { id: "adult",      label: "Adults Only",   sub: "No children at home" },
];

// ── Devotion Topic Categories ─────────────────────────────────────────────────
export const TOPIC_CATEGORIES = [
  {
    label: "Marriage & Partnership",
    topics: [
      "Loving your spouse unconditionally", "Communication in marriage",
      "Conflict resolution in marriage", "Keeping romance alive",
      "Forgiveness in marriage", "Spiritual intimacy with your spouse",
      "When marriage feels hard", "Building trust after hurt",
      "Serving your partner sacrificially", "Praying together as a couple",
    ],
  },
  {
    label: "Parenting",
    topics: [
      "Patience as a parent", "Discipline with grace", "Raising children in faith",
      "When your child is struggling", "Being present in a distracted world",
      "Letting go and trusting God with your children", "Parenting through fear and worry",
      "Modeling humility for your kids", "Speaking life over your children",
      "Teaching your children to pray",
    ],
  },
  {
    label: "Parenting Teenagers",
    topics: [
      "When your teenager pulls away", "Staying connected through rebellion",
      "Trusting God with your prodigal", "Setting boundaries with love",
      "Navigating peer pressure together", "Conversations about faith with teens",
    ],
  },
  {
    label: "Blended & Extended Family",
    topics: [
      "Navigating blended family life", "Honoring your parents as an adult",
      "Difficult in-law relationships", "Loving step-children well",
      "Co-parenting with grace", "When family wounds run deep",
      "Reconciling fractured family bonds", "Choosing unity over being right",
    ],
  },
  {
    label: "Family Seasons",
    topics: [
      "New baby and new beginnings", "Empty nest and letting go",
      "Grief and loss in the family", "Financial stress and family peace",
      "Moving and family transition", "Seasons of family change",
      "Work-life balance as a parent", "Rest and Sabbath for the family",
    ],
  },
  {
    label: "Faith & Identity",
    topics: [
      "Building a legacy of faith", "Family prayer rhythms",
      "Passing faith to the next generation", "When faith looks different in your family",
      "Finding purpose in your family role", "God's design for the family",
      "Imperfect families used by God",
    ],
  },
  {
    label: "Character & Virtue",
    topics: [
      "Humility in the home", "Gratitude as a family practice",
      "Joy when home life is hard", "Anger and self-control at home",
      "Grace for imperfect family members", "Forgiving family deeply",
      "Kindness as the culture of your home", "Guarding your heart as a spouse",
    ],
  },
];

// ── Child Learning Angles (used when perspective = child or together) ─────────
export const CHILD_INTEREST_ANGLES = [
  { icon: "🔬", label: "Science",       topics: ["Animals & Creatures", "Space & Stars", "Weather & Storms", "The Human Body", "Plants & Growing Things", "Experiments & Discovery"] },
  { icon: "📐", label: "Math",          topics: ["Patterns & Sequences", "Shapes & Geometry", "Big Numbers", "Puzzles & Logic"] },
  { icon: "🌍", label: "Geography",     topics: ["Countries & Cultures", "Oceans & Rivers", "Mountains & Landforms", "Maps & Exploration"] },
  { icon: "📜", label: "History",       topics: ["Ancient Civilizations", "Explorers & Inventors", "Heroes of the Faith", "Everyday Heroes"] },
  { icon: "🌿", label: "Nature",        topics: ["Seasons & Change", "Insects & Bugs", "Birds & Migration", "Forests & Ecosystems", "Rocks & Gems"] },
  { icon: "⚽", label: "Sports",        topics: ["Teamwork & Competition", "Perseverance & Losing Well", "Practice & Discipline"] },
  { icon: "🎨", label: "Arts & Story",  topics: ["Music & Rhythm", "Drawing & Creating", "Books & Storytelling"] },
];

// ── Family Roots Situations ───────────────────────────────────────────────────
export const SITUATIONS = [
  { icon:"💬", label:"Marriage Communication",    desc:"Struggling to connect or communicate with your spouse" },
  { icon:"👪", label:"Parenting Disagreements",   desc:"You and your partner disagree on how to parent" },
  { icon:"🤝", label:"Sibling Conflict",           desc:"Children fighting or struggling to get along" },
  { icon:"🏡", label:"In-Law Boundaries",          desc:"Navigating difficult extended family relationships" },
  { icon:"🌱", label:"Blended Family Challenges",  desc:"Integrating step-children or co-parenting situations" },
  { icon:"🔥", label:"Teenage Rebellion",          desc:"A teenager pushing back or making concerning choices" },
  { icon:"💸", label:"Financial Stress",           desc:"Money tension affecting your family life" },
  { icon:"🤲", label:"Aging Parent Care",          desc:"Navigating care for an aging or ill parent" },
  { icon:"🕊️", label:"Grief & Loss",              desc:"Your family is navigating loss or grief together" },
  { icon:"🪺", label:"Empty Nest Transition",      desc:"Adjusting to children leaving or family structure changing" },
];

// ── Family Roles ──────────────────────────────────────────────────────────────
export const FAMILY_ROLES = [
  { id:"parent",        label:"Parent",            sub:"Primary caregiver and guide"                    },
  { id:"spouse",        label:"Spouse / Partner",  sub:"Navigating marriage and partnership"            },
  { id:"adult_child",   label:"Adult Child",        sub:"Managing family relationships as a grown child" },
  { id:"single_parent", label:"Single Parent",      sub:"Leading a family on your own"                  },
];

// ── Family Experience Levels ──────────────────────────────────────────────────
export const FAMILY_EXPERIENCE = [
  { id:"newlywed",    label:"Newlywed / New Parent",  sub:"Just starting out in this family role"                  },
  { id:"established", label:"Established Family",      sub:"Several years in, navigating daily family life"         },
  { id:"seasoned",    label:"Seasoned",                sub:"Many years of family experience, facing new challenges"  },
  { id:"in_crisis",   label:"In Crisis",               sub:"Facing an acute family emergency or breaking point"     },
];

// ── Public Prayer Groups ──────────────────────────────────────────────────────
export const GROUPS = [
  "Couples Circle",
  "Praying Parents",
  "Single Parents",
  "Blended Families",
  "Expecting Families",
  "Families in Grief",
  "Adult Children",
  "Family Healing",
];
