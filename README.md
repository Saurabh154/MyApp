# Dynamic Form Builder

## 🚀 Live Demo : https://my-app-woad-pi.vercel.app/

### ✨ Project Overview

A dynamic form builder application built with React, Vite, Tailwind CSS, and ShadCN UI. This tool allows users to create nested form structures with real-time JSON schema output.

## ✨ Features

* **Dynamic Field Creation:** Add new form fields at the top level or within nested structures.
* **Field Customization:**
    * Edit the name/key of a field
    * Choose from various data types: String, Number, Boolean, Nested, ObjectID, Float, Array.
    * Add more fields dynamically
    * Add nested fields for the 'Nested' type (recursively)
    * Toggle field activation status.
    * Delete a field
   
* **Nested Structures:** Support for infinitely nested `object` and `array` types, allowing complex schema definitions.
* **Real-time JSON Output:** Instantly view the generated JSON schema reflecting all form modifications.
* **Intuitive UI:** Built with ShadCN UI for a clean, modern, and accessible user interface.
* **Responsive Design:** Adapts to different screen sizes using Tailwind CSS.

## 🚀 Technologies Used

* **React (v18+)**: Frontend JavaScript library for building user interfaces.
* **Vite**: Next-generation frontend tooling for a fast development experience.
* **Tailwind CSS**: A utility-first CSS framework for rapidly styling the application.
* **ShadCN UI**: A collection of reusable components built with Radix UI and Tailwind CSS, offering a sleek and customizable design system.
* **Lucide React**: Beautiful, open-source icons for React projects.
* **UUID**: For generating unique IDs for each form field.


## 🛠️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

1.  **Clone the repository:**

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    This will install all required Node.js packages, including React, Vite, Tailwind CSS, ShadCN UI dependencies, `uuid`, and `lucide-react`.

## ▶️ Running the Application

Once all dependencies are installed, you can start the development server:

```bash
npm run dev
