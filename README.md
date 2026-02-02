# HollowInk - Horror Blog

A dark, atmospheric horror blog built with React and Tailwind CSS, featuring Bengali folklore and horror stories.

## Features

- 🌑 Dark, immersive design with atmospheric effects
- 📖 Featured story section with full article reader
- 🏷️ Category filtering (Folklore, Urban, Psychological, Historical)
- 📱 Fully responsive design
- ⚡ Fast navigation with React Router
- 🎨 Custom Tailwind theme matching the exact design
- ✨ Smooth scroll animations and page transitions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
npm build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar
│   ├── Hero.jsx            # Homepage hero section
│   ├── FeaturedStory.jsx   # Featured story card
│   ├── StoryCard.jsx       # Individual story card
│   ├── StoriesGrid.jsx     # Stories grid with filters
│   ├── Newsletter.jsx      # Newsletter signup
│   └── Footer.jsx          # Footer component
├── pages/
│   ├── Home.jsx            # Homepage
│   ├── About.jsx           # About page
│   └── Article.jsx         # Article reader page
├── data/
│   └── stories.js          # Story data
├── App.jsx                 # Main app with routing
├── index.js                # Entry point
└── index.css               # Global styles + Tailwind
```

## Customization

### Adding New Stories

Edit `src/data/stories.js` and add your story object:

```javascript
{
  id: 6,
  title: "Your Story Title",
  category: "folklore", // folklore, urban, psychological, or historical
  date: "February 01, 2026",
  readTime: "10 min read",
  excerpt: "Your story excerpt...",
  tags: ["Tag1", "Tag2", "Tag3"],
  heroGradient: "linear-gradient(...)",
  heroGlow: "radial-gradient(...)",
  body: `<p>Your full story HTML here...</p>`
}
```

### Updating Author Info

Edit the About page in `src/pages/About.jsx` to add your name and bio.

### Changing Colors

Modify the color scheme in `tailwind.config.js` under the `theme.extend.colors` section.

## Technologies Used

- React 18
- React Router v6
- Tailwind CSS 3
- Custom Google Fonts (Cinzel, Cinzel Decorative, Cormorant Garamond)

## License

All rights reserved © 2026
