# Portfolio Website - HTML/CSS/JS Version

A modern, responsive portfolio website for Kwizera Arsene built with vanilla HTML, CSS, and JavaScript. Features include a stunning splash screen, smooth animations, multiple pages, and EmailJS integration for contact forms.

## 🚀 Features

- **Modern Design**: Clean, professional design with glass morphism effects
- **Responsive**: Fully responsive design that works on all devices
- **Multi-page**: Home, Schedule Call, Resume, and Contact pages
- **Animations**: 3D animations, scroll effects, and smooth transitions
- **Contact Form**: EmailJS integration for form submissions
- **Performance**: Optimized for fast loading and smooth performance
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Offline Support**: Service worker for basic offline functionality

## 📁 File Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles/
│   ├── main.css        # Main styles and layout
│   ├── components.css  # Component-specific styles
│   └── animations.css  # Animation styles
├── js/
│   ├── main.js         # Main JavaScript functionality
│   ├── animations.js   # Advanced animations
│   └── forms.js        # Form handling and validation
├── sw.js               # Service worker (optional)
├── README.md           # This file
└── EmailJS_Setup_Instructions.md
```

## 🛠️ Setup Instructions

### 1. Download Files

Download all the files and maintain the folder structure as shown above.

### 2. EmailJS Configuration (Optional)

To enable the contact form functionality:

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. Set up an email service (Gmail recommended)
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Update the following files:

**In `/js/main.js`:**
```javascript
// Replace these with your actual EmailJS credentials
emailjs.init("your_public_key_here");
const serviceId = 'your_service_id';
const templateId = 'your_template_id';
```

**In `/js/forms.js`:**
```javascript
// Replace these with your actual EmailJS credentials
const serviceId = 'service_xxxxxxx';
const templateId = 'template_xxxxxxx';
```

### 3. Serve the Files

Since the website uses ES6 modules and external APIs, you need to serve it through a web server (not just open the HTML file directly).

#### Option 1: Using Python (if installed)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option 2: Using Node.js (if installed)
```bash
# Install a simple server
npm install -g http-server

# Serve the files
http-server
```

#### Option 3: Using VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Using any other local server
- XAMPP, WAMP, MAMP
- Apache or Nginx
- Any static file server

### 4. Access the Website

Open your browser and go to `http://localhost:8000` (or whatever port your server is using).

## 🎨 Customization

### Colors and Theming

The website uses CSS custom properties for theming. You can customize colors in `/styles/main.css`:

```css
:root {
  --primary: #6366f1;           /* Primary color */
  --secondary: #1e1e2e;         /* Secondary color */
  --background: #0a0a0f;        /* Background color */
  --foreground: #ffffff;        /* Text color */
  /* ... other variables */
}
```

### Content Updates

1. **Personal Information**: Update name, title, and contact details in `index.html`
2. **About Section**: Modify the about text and statistics
3. **Skills**: Update the skills list and proficiency levels
4. **Projects**: Replace project cards with your own projects
5. **Experience**: Update the timeline with your work history
6. **Resume**: Modify the resume page content

### Images

Replace the placeholder images with your own:
- Profile image in the hero section
- Project screenshots
- Any other images

Use the Unsplash API or your own images. Make sure to optimize images for web use.

## 📱 Browser Support

The website supports all modern browsers:
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 🔧 Development

### Adding New Pages

1. Add a new page div in `index.html`:
```html
<div id="new-page" class="page">
  <!-- Your content here -->
</div>
```

2. Add navigation logic in `/js/main.js`:
```javascript
case 'new-page':
  return document.getElementById('new-page');
```

3. Style your page in the CSS files

### Custom Animations

Add custom animations in `/styles/animations.css` and trigger them using JavaScript in `/js/animations.js`.

### Form Validation

Add custom validation rules in `/js/forms.js`:

```javascript
formValidator.addRule('custom', (value) => {
  // Your validation logic
  return true; // or false
});
```

## 📊 Performance

The website is optimized for performance:
- Lazy loading for images
- CSS and JS minification (in production)
- Service worker for caching
- Optimized animations
- Responsive images

## 🔒 Security

- All forms use CSRF protection through EmailJS
- No sensitive data is stored client-side
- External dependencies are served from CDNs

## 📧 EmailJS Template

When setting up EmailJS, use this template structure:

```
Subject: New Contact Form Message - {{subject}}

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

Template variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Message subject
- `{{message}}` - Message content

## 🚀 Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify
1. Drag and drop your folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository for automatic deployments

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

## 🤝 Contributing

If you find bugs or want to contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you need help with setup or customization:
- Email: kwizerarsn@gmail.com
- Check the EmailJS setup instructions
- Review the code comments for guidance

---

Made with ❤️ by Kwizera Arsene
