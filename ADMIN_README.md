# BirdAI Admin Email Collection System

## 🚀 Quick Access

**URL:** `http://localhost:3000/admin/emails`

**Login Credentials:**
- **Username:** `admin`
- **Password:** `birdai2024`

## 📊 Dashboard Features

### 1. **Authentication System**
- Secure login with username/password
- Session persistence using localStorage
- Logout functionality

### 2. **Statistics Dashboard**
- **Total Emails:** Count of all collected emails
- **Research Papers:** Emails from research paper downloads
- **Join the Signal:** Emails from contact form submissions
- **Latest Collection:** Date of most recent email

### 3. **Filter System**
- **All:** View all collected emails
- **Research Papers:** Filter by research paper downloads only
- **Join the Signal:** Filter by contact form submissions only

### 4. **Email Data Table**
- Email address
- Source (Research/Contact)
- Name
- Company
- Date/Time
- IP Address
- File name (for research papers)

### 5. **Export Functionality**
- **CSV Export:** Download all filtered data as CSV file
- Automatic filename with current date

## 🔧 Technical Implementation

### API Endpoints

1. **GET `/api/admin/emails`**
   - Returns all collected emails
   - Sorted by timestamp (newest first)

2. **POST `/api/collect-email`**
   - Collects emails from forms
   - Stores in `data/emails/research-emails.json`

### Data Storage
- **Location:** `data/emails/research-emails.json`
- **Format:** JSON array with email objects
- **Fields:** email, source, name, company, message, timestamp, userAgent, ip

### Security Features
- Frontend authentication (can be enhanced with backend auth)
- IP address tracking
- User agent logging
- Timestamp recording

## 🎯 Usage Instructions

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```

2. **Access Admin Panel:**
   - Navigate to `http://localhost:3000/admin/emails`
   - Enter credentials: `admin` / `birdai2024`

3. **View Email Data:**
   - Browse all collected emails
   - Use filters to view specific sources
   - Export data as needed

4. **Collect New Emails:**
   - Emails are automatically collected when users:
     - Download research papers
     - Submit contact forms
   - Data is stored in real-time

## 🔒 Security Notes

- **Current Implementation:** Basic frontend authentication
- **Recommended Enhancement:** Add backend authentication middleware
- **Data Protection:** Consider implementing rate limiting and validation
- **Production:** Use environment variables for credentials

## 📈 Sample Data

The system comes with 5 sample email entries demonstrating:
- Research paper downloads (3 entries)
- Contact form submissions (2 entries)
- Various company types and user agents

## 🛠️ Troubleshooting

### Common Issues:

1. **Module Resolution Errors:**
   - Clear `.next` directory: `rm -rf .next`
   - Restart development server

2. **Data Not Loading:**
   - Check `data/emails/research-emails.json` exists
   - Verify file permissions

3. **Authentication Issues:**
   - Clear browser localStorage
   - Check credentials match exactly

### Development Commands:
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📞 Support

For technical issues or feature requests, please refer to the main project documentation or create an issue in the repository. 