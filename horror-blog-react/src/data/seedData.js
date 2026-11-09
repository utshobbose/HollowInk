// Initial persistent seed data for Hollow Ink
// Reflects genuine South Asian Gothic folklore, horror, and dark fantasy narratives

export const SEED_USERS = [
  {
    id: "usr_reader_1",
    email: "reader@hollowink.com",
    password: "reader123",
    name: "Wandering Scholar",
    role: "reader",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Devourer of midnight archives, collector of riverside folklore, and wandering student of forgotten South Asian horrors.",
    saveOnDevice: true,
    createdAt: "2025-10-12T08:00:00Z"
  },
  {
    id: "usr_writer_aarav",
    email: "aarav@hollowink.com",
    password: "writer123",
    name: "Aarav Sharma",
    role: "writer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Specializing in the shadowed corners of Bengal folklore, Aarav Sharma unearths tales long buried by time. His work explores the visceral tension between modernity and ancient supernatural entities, weaving narratives that linger long after the final word.",
    specialty: "Bengal Gothic & River Lore",
    twitter: "@aarav_ink",
    instagram: "@aaravsharma_folklore",
    createdAt: "2025-08-15T10:30:00Z"
  },
  {
    id: "usr_writer_utshob",
    email: "utshob@hollowink.com",
    password: "writer123",
    name: "Utshob Bose",
    role: "writer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Horror writer and folklorist rooted in the decaying ancestral mansions and tidal silt of Bengal and the Ganges delta.",
    specialty: "Sundarbans Mysticism & Colonial Dread",
    twitter: "@utshob_bose",
    instagram: "@utshob_horror",
    createdAt: "2025-06-01T12:00:00Z"
  },
  {
    id: "usr_admin_sanctum",
    email: "admin@hollowink.com",
    password: "admin123",
    name: "Sanctum Keeper",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "Master archivist of the Hollow Ink vaults. Overseer of submissions and ledger integrity.",
    createdAt: "2025-01-01T00:00:00Z"
  }
];

export const SEED_STORIES = [
  {
    id: "story_1",
    slug: "the-weaver-of-silent-threads",
    title: "The Weaver of Silent Threads",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "folklore",
    region: "Varanasi",
    mood: "Supernatural",
    readTime: "14 min read",
    wordCount: 2850,
    excerpt: "In the shadow-veiled alleys of old Varanasi, a weaver creates saris that capture not just color, but the final, whispered secrets of the dying. When a patron requests a garment woven from a curse, the loom demands more than thread.",
    date: "February 02, 2026",
    lastModified: "2026-02-02T19:30:00Z",
    status: "published",
    featured: true,
    viewsCount: 1420,
    reactionsCount: 312,
    // Eerie ancient stone shrine & moonlit ruins
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117 0%, #201015 40%, #0a1510 100%)",
    heroGlow: "radial-gradient(ellipse 60% 50% at 40% 60%, rgba(155,36,36,0.3) 0%, transparent 70%)",
    tags: ["Varanasi", "Loom", "Death Lore", "Gothic"],
    body: `
      <p class="mb-6 text-text-primary font-light">The loom at Kashi Lane did not clatter like ordinary wood. When Pandit Dinanath pushed the shuttle across the taut silk, the sound was that of dry leaves dragging over slate — or fingernails scrabbling against the inner lid of a cedar box.</p>
      <p class="mb-6 text-text-primary font-light">For four generations, the Dinanath family had supplied bridal trousseaus to the aristocratic houses of Awadh and Bengal. But behind the heavy brass bolt of the inner workshop lay a second loom, strung not with mulberry silk, but with the spun hair of widows and silver filaments dipped in river silt taken from the burning ghats during the dark moon of Kartik.</p>
      <div class="bg-gradient-to-br from-[rgba(42,61,46,0.15)] to-[rgba(58,74,92,0.1)] border border-accent-gold-dim rounded-lg p-5 my-8 relative">
        <p class="text-[0.65rem] tracking-[0.2em] uppercase text-accent-gold mb-2 font-heading">Archivist Note</p>
        <p class="text-[0.9rem] text-[#8a7e6a] mb-0">Recorded in Varanasi, Manikarnika Ghat district. Local weavers still maintain strict taboos regarding looms worked between sunset and the third hour of the night.</p>
      </div>
      <p class="mb-6 text-text-primary font-light">The order had arrived with no name, delivered by an ascetic whose eyes were milky with cataracts. A purse of silver rupees and a single strand of crimson thread soaked in sandalwood. The instructions were concise: <em>"Weave the pallu so that whichever woman wears it shall remember the promises made to those she buried alive."</em></p>
      <div class="border-l-2 border-accent-blood pl-5 pr-5 py-3 my-9 bg-accent-blood-dim rounded-r-md italic text-[#b89e7a] text-[1.2rem] leading-[1.7]">
        "A garment is never merely fabric," Dinanath once told his apprentice. "It holds the warmth of skin, the sweat of fever, and if woven in silence, it holds the unresolved will of what refused to cross the river."
      </div>
      <p class="mb-6 text-text-primary font-light">On the third night of weaving, the room turned bitter cold. The brass oil lamp flickered blue. In the reflection of the silver shuttle, Dinanath saw not his own weathered face, but three women standing behind his stool, their hands placed gently upon the warp threads.</p>
      <p class="mb-6 text-text-primary font-light">None of them possessed shadows. And when the sari was finally taken off the frame, it weighed twice as much as any silk ever known to man.</p>
    `
  },
  {
    id: "story_2",
    slug: "whispers-in-the-banyan",
    title: "The Whispers in the Banyan",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "folklore",
    region: "Bengal",
    mood: "Chilling",
    readTime: "11 min read",
    wordCount: 2150,
    excerpt: "The ancient tree at the center of the village has stood for centuries. Tonight, as the autumnal storms brew over the river, it demands a forgotten sacrifice to keep the darkness at bay.",
    date: "January 26, 2026",
    lastModified: "2026-01-26T14:15:00Z",
    status: "published",
    featured: false,
    viewsCount: 980,
    reactionsCount: 215,
    // Spooky, dark tangled misty trees & roots (Ancient Banyan)
    coverImage: "https://images.unsplash.com/photo-1601873968252-6862fba1ff87?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117, #1a1525 40%, #0f1a10 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(42,61,46,0.3), transparent 70%)",
    tags: ["Bengal", "Sacred Tree", "Night Spirits", "Folklore"],
    body: `
      <p class="mb-6 text-text-primary font-light">The villagers spoke of the roots not as wood, but as sinew. When the monsoon winds howled through the delta, the branches didn't sway; they reached. I had come to document the myth, not realizing the myth was already documenting me.</p>
      <p class="mb-6 text-text-primary font-light">Old Man Biren sat on the crumbling masonry bench surrounding the banyan's primary trunk. His pipe had gone cold hours ago, but he continued to draw on the blackened stem as if drinking smoke from the root system itself.</p>
      <p class="mb-6 text-text-primary font-light">"Listen closely, son of the city," he whispered, pointing with a gnarled finger toward the aerial roots that hung like nooses in the mist. "When the owl goes quiet before midnight, it is not hunting. It is waiting for the council to begin."</p>
    `
  },
  {
    id: "story_3",
    slug: "the-last-tide-of-sundarban",
    title: "The Last Tide of Sundarban",
    authorId: "usr_writer_utshob",
    authorName: "Utshob Bose",
    category: "folklore",
    region: "Bengal",
    mood: "Haunted",
    readTime: "18 min read",
    wordCount: 3400,
    excerpt: "A grieving salt trader breaks the one ancient rule that keeps an inhuman hunger sealed beneath the mangroves — and something far older than gods steps through the door.",
    date: "January 28, 2026",
    lastModified: "2026-01-28T22:00:00Z",
    status: "published",
    featured: false,
    viewsCount: 2100,
    reactionsCount: 489,
    // Misty, dark mangrove swamp waters & black tide
    coverImage: "https://images.unsplash.com/photo-1589556183130-530470785fab?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117 0%, #1a1020 40%, #0a1510 100%)",
    heroGlow: "radial-gradient(ellipse 60% 50% at 40% 60%, rgba(155,36,36,0.25) 0%, transparent 70%)",
    tags: ["Bon Bibi", "Sundarban", "Bengal", "Delta"],
    body: `
      <p class="mb-6 text-text-primary font-light">There is a place in the mouth of the Bengal delta where the river does not flow — it swallows. The mangroves of Sundarban stretch like blackened fingers into the Bay of Bengal, and within that labyrinth of roots and tidal mud, the air itself tastes of rot and salt and something older. Something that predates the gods.</p>
      <p class="mb-6 text-text-primary font-light">This is not a story that was invented. It is a story that <em>surfaced</em> — like a body pushed up through the silt after the tide retreated in the winter of 1757, the year the British East India Company tightened its grip on Bengal after the fall of Murshidabad.</p>
      <div class="border-l-2 border-accent-blood pl-5 pr-5 py-3 my-9 bg-accent-blood-dim rounded-r-md italic text-[#b89e7a] text-[1.2rem] leading-[1.7]">
        Bon Bibi was their protector. A Muslim saint who ruled the forest and kept the great tiger at bay. But when Dukhi broke the vow and stepped past the saltwater boundary without prayer, the seal cracked.
      </div>
      <p class="mb-6 text-text-primary font-light">The water broke. Karamkali was half-destroyed. Fourteen people were found empty of breath, their faces turned permanently toward the rising dark.</p>
    `
  },
  {
    id: "story_4",
    slug: "the-midnight-rickshaw",
    title: "The Midnight Rickshaw",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "urban",
    region: "Bengal",
    mood: "Chilling",
    readTime: "9 min read",
    wordCount: 1650,
    excerpt: "A tired night commuter on the desolate streets of North Kolkata hails a rickshaw with no driver seat, only to realize the puller has no feet.",
    date: "January 19, 2026",
    lastModified: "2026-01-19T20:10:00Z",
    status: "published",
    featured: false,
    viewsCount: 840,
    reactionsCount: 178,
    // Dark wet atmospheric Kolkata night street & shadows
    coverImage: "https://images.unsplash.com/photo-1648964562779-36b7231fa44e?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117, #1a1020 40%, #150d1a 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(100,42,120,0.25), transparent 70%)",
    tags: ["Kolkata", "Urban Legend", "Rain", "Streets"],
    body: `
      <p class="mb-6 text-text-primary font-light">The rain over Shyambazar was not rain; it was a gray curtain of exhaust fumes and cemetery mist. The trams had ceased ringing an hour ago, leaving the cobblestones wet and greasy under the sodium lamps.</p>
      <p class="mb-6 text-text-primary font-light">Subhas was desperate to reach Bagbazar before the midnight ferry shut down. When the brass bell chimed from down the unlit alley, he stepped off the curb without checking the shadows.</p>
      <p class="mb-6 text-text-primary font-light">"Nimtala Ghat," he called out, climbing onto the cracked leather seat. The puller nodded, his head wrapped in a mud-splattered gamcha. Only when the wooden wheels began to roll over the tram tracks did Subhas notice the rhythmic slap of bare feet was completely missing.</p>
    `
  },
  {
    id: "story_5",
    slug: "beyond-the-tharavadu",
    title: "Beyond the Tharavadu",
    authorId: "usr_writer_utshob",
    authorName: "Utshob Bose",
    category: "horror",
    region: "Malabar",
    mood: "Haunted",
    readTime: "15 min read",
    wordCount: 3100,
    excerpt: "Deep within rural Kerala, an ancestral Tharavadu holds a locked wooden chamber that must never be unlatched after twilight, lest the Yakshi reclaim her dowry.",
    date: "January 10, 2026",
    lastModified: "2026-01-10T16:00:00Z",
    status: "published",
    featured: false,
    viewsCount: 1120,
    reactionsCount: 245,
    // Dark ancient wooden gothic structure & shadowy ancestral arch
    coverImage: "https://images.unsplash.com/photo-1576308598676-59f4664583b8?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117 0%, #151a1a 40%, #0d1510 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(58,74,92,0.3), transparent 70%)",
    tags: ["Kerala", "Tharavadu", "Yakshi", "Ancestral Horror"],
    body: `
      <p class="mb-6 text-text-primary font-light">The woodwork of the nalukettu was carved with serpents whose eyes were inlaid with ruby glass. At the center of the inner courtyard, rainwater gathered in a sunken stone cistern that had not run dry since the kingdom of Travancore fell.</p>
      <p class="mb-6 text-text-primary font-light">"Every house in Malabar breathes," grandmother Radha said, grinding betel nut in an iron mortar. "But this house holds its breath. And when it exhales, you must keep your eyes on the lime-plastered floor."</p>
    `
  },
  {
    id: "story_6",
    slug: "the-parsi-watchmaker",
    title: "The Parsi Watchmaker",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "psychological",
    region: "Bengal",
    mood: "Chilling",
    readTime: "12 min read",
    wordCount: 2400,
    excerpt: "In a dusty shop off Bowbazar, an antique clockmaker repairs timepieces that have stopped at the precise second their owners met tragic ends.",
    date: "December 22, 2025",
    lastModified: "2025-12-22T11:00:00Z",
    status: "published",
    featured: false,
    viewsCount: 760,
    reactionsCount: 189,
    // Eerie antique pocket watch & dusty dark timepiece
    coverImage: "https://images.unsplash.com/photo-1562537218-26057ef20502?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117 0%, #1a1510 40%, #1a0f0d 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(155,36,36,0.2), transparent 70%)",
    tags: ["Kolkata", "Clocks", "Mortality", "Psychological"],
    body: `
      <p class="mb-6 text-text-primary font-light">The brass pendulum swung through air dense with machine oil and desiccated lavender. Sorabji Vakil did not use electric magnifiers; he wore a jeweler's loupe fastened to his spectacles with blackened twine.</p>
      <p class="mb-6 text-text-primary font-light">"A watch does not count life," he would tell the widow who had brought her husband's pocket watch from the Hooghly docks. "It measures how much borrowed daylight remains before the debt is called in."</p>
    `
  },
  {
    id: "story_7",
    slug: "tide-country-spirits",
    title: "Tide Country Spirits",
    authorId: "usr_writer_utshob",
    authorName: "Utshob Bose",
    category: "folklore",
    region: "Delta Bengal",
    mood: "Supernatural",
    readTime: "16 min read",
    wordCount: 2900,
    excerpt: "The fishermen know not to cast their nets when the river turns ink-black. When Kripa casts anyway, he drags up an idol that weeps warm brine.",
    date: "December 14, 2025",
    lastModified: "2025-12-14T09:40:00Z",
    status: "published",
    featured: false,
    viewsCount: 940,
    reactionsCount: 204,
    // Dark ominous misty woods and lake reflections
    coverImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117, #1a1525 40%, #0f1a10 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(42,61,46,0.25), transparent 70%)",
    tags: ["Sundarbans", "Fisherman", "Delta Bengal", "Ancient"],
    body: `
      <p class="mb-6 text-text-primary font-light">The mud in the tidal country remembers every footprint pressed into it. And sometimes, when the tide withdraws at the turn of the moon, it keeps the footprint and releases the owner without their soul.</p>
    `
  },
  {
    id: "story_8",
    slug: "the-jatra-dancers-anklet",
    title: "The Jatra Dancer's Anklet",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "fantasy",
    region: "Bengal",
    mood: "Haunted",
    readTime: "13 min read",
    wordCount: 2300,
    excerpt: "A travelling theatre troupe arrives in a remote village that isn't marked on any survey map. Their lead dancer puts on a bronze anklet excavated from a river mound — and the rhythm will not let her stop.",
    date: "December 02, 2025",
    lastModified: "2025-12-02T18:20:00Z",
    status: "published",
    featured: false,
    viewsCount: 880,
    reactionsCount: 195,
    // Eerie ceremonial flames & sinister folk ritual stage
    coverImage: "https://images.unsplash.com/photo-1574336310290-8f545d91cd5f?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117, #1a1020 40%, #150d1a 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(100,42,120,0.3), transparent 70%)",
    tags: ["Jatra", "Dance", "Possession", "Folk Theatre"],
    body: `
      <p class="mb-6 text-text-primary font-light">The ghungroos were tarnished green with verdigris, heavy bells forged in an era when copper was alloyed with charnel ash. When Maya stepped onto the earthen stage under the kerosene petromaxes, her feet moved before the harmonium began.</p>
    `
  },
  {
    id: "story_9",
    slug: "rituals-of-the-forgotten-ghat",
    title: "Rituals of the Forgotten Ghat",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "folklore",
    region: "Varanasi",
    mood: "Supernatural",
    readTime: "15 min read",
    wordCount: 2700,
    excerpt: "Between the burning flames of Harishchandra and the silence of Assi lies a stone staircase sunken beneath the river slime, frequented only by priests without faces.",
    date: "November 18, 2025",
    lastModified: "2025-11-18T14:00:00Z",
    status: "published",
    featured: false,
    viewsCount: 690,
    reactionsCount: 154,
    // Ancient stone steps & ghat architecture in the dark night
    coverImage: "https://images.unsplash.com/photo-1785140387910-06107bd56eb9?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117 0%, #201015 40%, #0a1510 100%)",
    heroGlow: "radial-gradient(ellipse 60% 50% at 40% 60%, rgba(155,36,36,0.3), transparent 70%)",
    tags: ["Varanasi", "Ghat", "River Ganges", "Ritual"],
    body: `<p class="mb-6 text-text-primary font-light">The stone steps descended into the sacred water, but the water around them refused to reflect the cremation fires blazing fifty paces upriver.</p>`
  },
  {
    id: "story_10",
    slug: "the-shadow-of-the-haveli",
    title: "The Shadow of the Haveli",
    authorId: "usr_writer_utshob",
    authorName: "Utshob Bose",
    category: "horror",
    region: "Rajasthan",
    mood: "Haunted",
    readTime: "17 min read",
    wordCount: 3100,
    excerpt: "In the desert ruins of Shekhawati, a fresco painted with crushed lapis and antimony depicts a courtyard family that shifts position every time the sun crosses the meridian.",
    date: "November 05, 2025",
    lastModified: "2025-11-05T12:00:00Z",
    status: "published",
    featured: false,
    viewsCount: 1040,
    reactionsCount: 230,
    // Desert ruins / historic Rajasthani haveli in deep atmospheric shadows
    coverImage: "https://images.unsplash.com/photo-1682414181885-a22c7a922cd7?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117 0%, #1a1510 40%, #1a0f0d 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(155,36,36,0.2), transparent 70%)",
    tags: ["Rajasthan", "Haveli", "Fresco", "Desert Gothic"],
    body: `<p class="mb-6 text-text-primary font-light">The wind from the dunes carried grit that stripped the lime from the outer walls, revealing older layers beneath — and the faces that had been sealed under the masonry.</p>`
  },
  // SUBMISSIONS WAITING FOR ADMIN REVIEW IN MODERATION QUEUE
  {
    id: "story_sub_1",
    slug: "the-weeping-banyans-of-malabar",
    title: "The Weeping Banyans of Malabar",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "folklore",
    region: "Malabar",
    mood: "Haunted",
    readTime: "12 min read",
    wordCount: 2200,
    excerpt: "A plantation supervisor uncovers an ancient stone serpent grove beneath the rubber trees, triggering a curse that weeps sap the color of clotted blood.",
    date: "November 04, 2026",
    lastModified: "2026-11-04T18:00:00Z",
    status: "submitted",
    featured: false,
    viewsCount: 0,
    reactionsCount: 0,
    // Dark ominous misty woods
    coverImage: "https://images.unsplash.com/photo-1512810730836-1a7cde39c455?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117, #1a1525 40%, #0f1a10 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(42,61,46,0.25), transparent 70%)",
    tags: ["Malabar", "Sacred Grove", "Serpent", "Folklore"],
    submittedAt: "2026-11-04T18:00:00Z",
    body: `<p class="mb-6 text-text-primary font-light">The rubber latex was supposed to flow milky white into the coconut shells strapped to the scored bark. But on the northern perimeter of the estate, where the ground sloped toward the ravine, the sap dripped rusty red, thick as arterial blood.</p>`
  },
  {
    id: "story_sub_2",
    slug: "echoes-in-the-stepwell",
    title: "Echoes in the Stepwell",
    authorId: "usr_writer_utshob",
    authorName: "Utshob Bose",
    category: "horror",
    region: "Rajasthan",
    mood: "Supernatural",
    readTime: "14 min read",
    wordCount: 2600,
    excerpt: "A drought forces villagers to descend to the thirteenth tier of an abandoned subterranean baoli, where the stagnant water whispers answers to unasked questions.",
    date: "November 04, 2026",
    lastModified: "2026-11-04T15:30:00Z",
    status: "submitted",
    featured: false,
    viewsCount: 0,
    reactionsCount: 0,
    // Deep underground stone vaults & subterranean staircase
    coverImage: "https://images.unsplash.com/photo-1780324269424-db19c53c19f4?auto=format&fit=crop&w=1200&q=80",
    heroGradient: "linear-gradient(135deg, #0d1117 0%, #151a1a 40%, #0d1510 100%)",
    heroGlow: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(58,74,92,0.3), transparent 70%)",
    tags: ["Rajasthan", "Stepwell", "Baoli", "Underground"],
    submittedAt: "2026-11-04T15:30:00Z",
    body: `<p class="mb-6 text-text-primary font-light">Eighty-four stone steps carved in geometric symmetry plummeted into the black throat of the earth. When Vikram dropped his bronze bucket down the shaft, the splash came back three minutes late.</p>`
  },
  // WRITER DRAFTS
  {
    id: "story_draft_1",
    slug: "monsoon-shadows",
    title: "Monsoon Shadows",
    authorId: "usr_writer_aarav",
    authorName: "Aarav Sharma",
    category: "folklore",
    region: "Bengal",
    mood: "Chilling",
    readTime: "8 min read",
    wordCount: 1400,
    excerpt: "Heavy rains wash away more than dirt when the cemetery embankment breaks along the riverbank.",
    date: "September 12, 2025",
    lastModified: "2025-09-12T10:00:00Z",
    status: "draft",
    featured: false,
    viewsCount: 0,
    reactionsCount: 0,
    // Dark heavy rain over wet riverbank
    coverImage: "https://images.unsplash.com/photo-1499184949561-704bad5f6cd6?auto=format&fit=crop&w=1200&q=80",
    tags: ["Monsoon", "Bengal", "Rain", "River"],
    body: `<p class="mb-6 text-text-primary font-light">Draft notes: Focus on the sounds of water seeping through floorboards and the figures standing outside the verandah screen in the torrential darkness.</p>`
  }
];

export const SEED_BOOKMARKS = [
  {
    userId: "usr_reader_1",
    storyId: "story_2",
    listType: "to_read",
    addedAt: "2026-02-01T10:00:00Z"
  },
  {
    userId: "usr_reader_1",
    storyId: "story_1",
    listType: "favorites",
    addedAt: "2026-01-29T14:30:00Z"
  },
  {
    userId: "usr_reader_1",
    storyId: "story_3",
    listType: "favorites",
    addedAt: "2026-01-28T23:00:00Z"
  }
];

export const SEED_HISTORY = [
  {
    userId: "usr_reader_1",
    storyId: "story_1",
    progressPercent: 85,
    lastReadAt: "2026-02-03T19:40:00Z"
  },
  {
    userId: "usr_reader_1",
    storyId: "story_3",
    progressPercent: 100,
    lastReadAt: "2026-01-30T21:15:00Z"
  },
  {
    userId: "usr_reader_1",
    storyId: "story_4",
    progressPercent: 45,
    lastReadAt: "2026-01-25T11:20:00Z"
  }
];
