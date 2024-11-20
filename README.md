# GameShack

**GameShack** is a web application that allows users to create and host interactive quiz and game nights. Designed for versatility and engagement, it combines the functionality of presentation tools with dynamic game mechanics. Hosts can create customized slides, manage game sessions, and provide players with a seamless, engaging experience.

---

## Table of Contents

- [Features](#features)
  - [Slide Types](#slide-types)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Code Structure](#code-structure)
- [Developer Documentation](#developer-documentation)
- [Contributors](#contributors)

---

## Features

### Slide Types

GameShack supports the creation of quizzes with the following slide types:

1. **Information Slide**
   - Presents information to players without interaction.

2. **Score Slide**
   - Displays the scores and rankings of players.

3. **Question Slide**
   - Interactive slides with the following question types:
     - **Single Answer MCQ**: Players select one correct option.
     - **Multiple Answer MCQ**: Players select multiple correct options.
     - **Text Answer**: Players provide a text response.
     - **Rank Answers**: Players arrange answers in the correct order.

---

## Technologies

GameShack is built using modern technologies for optimal performance and maintainability:
- **Figma**: For prototyping and design.
- **TypeScript**: Primary programming language.
- **shadcn**: UI component library.
- **React**: Frontend framework.
- **Firebase**: Backend and database solution.

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/FKnorring/GameShack.git
   cd GameShack
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

For more details, visit the [Developer Documentation](#developer-documentation).

---

## Code Structure

- **src/components**: Contains reusable React components.
- **src/pages**: Defines application routes.
- **src/styles**: Global and component-specific styles.
- **src/utils**: Utility functions and helpers.
- **src/services**: Backend services and API integration.

Refer to the inline documentation in each file for details.

---

## Developer Documentation

### Hosting a Game
- Navigate to the host interface and create a quiz by combining different slide types.
- Save the game as a reusable template for future sessions.

### Player Interaction
- Players can join the game room using a unique code and interact through an intuitive interface.

### Adding New Features
- To add a new question type, extend .... [TODO]

---

## Contributors

- Filip von Knorring (Project Manager)
- Jacob Dillström
- Elisabet Hansson
- Nils Persson
- Ramez Shakarna
