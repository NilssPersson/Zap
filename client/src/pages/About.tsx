import nils from '../assets/photos/nils.jpeg'
import ramez from "../assets/photos/ramez.jpeg";
import lisa from "../assets/photos/lisa.jpeg";
import jacob from "../assets/photos/jacob.jpeg";
import filip from "../assets/photos/filip.jpeg";

function About() {
  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <p className="text-white-600 mb-4">
        Welcome to our about page. This is where you can learn more about our
        company and mission.
      </p>
      <h3 className="text-2xl font-bold mb-4">Who are we?</h3>
      <div className="grid grid-cols-3 mb-6">
        <div className="flex flex-col items-center">
          <img
            src={lisa}
            alt="Lisa Hansson"
            className="w-24 h-24 rounded-full shadow-lg mb-2"
          />
          <p className="text-center text-white-700">Lisa Hansson</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={nils}
            alt="Nils Persson"
            className="w-24 h-24 rounded-full shadow-lg mb-2"
          />
          <p className="text-center text-white-700">Nils Persson</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={ramez}
            alt="Ramez Shakarna"
            className="w-24 h-24 rounded-full shadow-lg mb-2"
          />
          <p className="text-center text-white-700">Ramez Shakarna</p>
        </div>
      </div>
      <div className="grid grid-cols-2 mb-6">
        <div className="flex flex-col items-center">
          <img
            src={filip}
            alt="Filip von Knorring"
            className="w-24 h-24 rounded-full shadow-lg mb-2"
          />
          <p className="text-center text-white-700">Filip von Knorring</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={jacob}
            alt="Jacob Dillström"
            className="w-24 h-24 rounded-full shadow-lg mb-2"
          />
          <p className="text-center text-white-700">Jacob Dillström</p>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">Goal of the project</h3>
      <p className="text-white-600 mb-4">
        We’re a team of students from Uppsala University, here to bring you a
        fun, easy way to create interactive quizzes! Born out of our Software
        Engineering Project course, our mission is simple: make quiz-making a
        blast for everyone. Dive into our ready-to-go templates and create
        something awesome in minutes!
      </p>
      <h3 className="text-2xl font-bold mb-4">Current status</h3>
      <p className="text-white-600 mb-4">
        The project is currently in its start-up phase, to be continued...
      </p>
      <a
        href="https://github.com/FKnorring/GameShack"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl font-bold mb-8 hover:text-green-700"
      >
        Check out our GitHub Repository!
      </a>
    </div>
  );
} 

export default About