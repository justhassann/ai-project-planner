# 🚀 AI Project Planner & Trello Launcher

A single-page application that uses the Gemini AI to instantly turn a high-level project idea into a structured plan and a functional Trello board with one click.

This project was built to demonstrate a full-stack skillset, including sophisticated AI prompt engineering and complex, multi-step API integrations.

---

### ✨ Live Demo & Screenshot

**(I highly recommend you record a short GIF of the app working and embed it here. A moving image is 10x more impressive than a static one. You can use a tool like Giphy Capture or EZGif to create one from your Loom video.)**

![AI Project Planner Demo](URL_TO_YOUR_GIF_OR_SCREENSHOT)

---

### 🌟 Key Features

* **AI-Powered Plan Generation:** Leverages the Gemini API to break down complex goals into actionable, phase-by-phase checklists.
* **Structured & Interactive Output:** Displays the generated plan in a clean, easy-to-read, and interactive format.
* **1-Click Export to Trello:** Uses the Trello API to automatically create a new board, lists for each phase, and cards for each task, turning a plan into a live project in seconds.
* **Modern Single-Page App:** Built with a fast, responsive UI for a seamless user experience.

---

### 🛠️ Tech Stack & Tools

* **Frontend:** React (with Vite), TypeScript, Tailwind CSS
* **Backend:** Supabase Edge Functions
* **AI:** Google Gemini API
* **API Integration:** Trello REST API
* **Deployment:** Vercel / Netlify

---

### ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites**

* Node.js installed
* A Supabase account
* API keys for Gemini and Trello

**Installation & Setup**

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/justhassann/ai-project-planner.git](https://github.com/justhassann/ai-project-planner.git)
    cd ai-project-planner
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    * Create a `.env` file in the root of the project.
    * Add the following variables with your keys:
        ```
        VITE_SUPABASE_URL=YOUR_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY
        TRELLO_API_KEY=YOUR_TRELLO_API_KEY
        TRELLO_API_TOKEN=YOUR_TRELLO_API_TOKEN
        ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

---

### 📞 Contact

Muhammad Hassan - [linkedin.com/in/justhassan](https://linkedin.com/in/justhassan)
