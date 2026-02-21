export interface Quote {
  text: string;
  author: string;
  field?: string;
}

export const quotes: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    field: "Entrepreneur & Innovator"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    field: "Political Leader & Activist"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    field: "Musician & Artist"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    field: "Philosopher & Leader"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
    field: "Author"
  },
  {
    text: "Intelligence is the ability to adapt to change.",
    author: "Stephen Hawking",
    field: "Theoretical Physicist"
  },
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
    field: "Ancient Philosopher"
  },
  {
    text: "I have no special talents. I am only passionately curious.",
    author: "Albert Einstein",
    field: "Theoretical Physicist"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    field: "Actress & Author"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    field: "Statesman & Author"
  },
  {
    text: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle",
    field: "Ancient Philosopher"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    field: "Polymath & Founding Father"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    field: "Author"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    field: "Polymath & Artist"
  },
  {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    field: "Ancient Philosopher"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    field: "Ancient Philosopher"
  },
  {
    text: "Genius is one percent inspiration and ninety-nine percent perspiration.",
    author: "Thomas Edison",
    field: "Inventor"
  },
  {
    text: "The function of education is to teach one to think intensively and to think critically.",
    author: "Martin Luther King Jr.",
    field: "Civil Rights Leader"
  },
  {
    text: "I am still learning.",
    author: "Michelangelo",
    field: "Artist & Sculptor"
  },
  {
    text: "The beautiful thing about learning is nobody can take it away from you.",
    author: "B.B. King",
    field: "Musician"
  },
  {
    text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
    author: "Richard Feynman",
    field: "Theoretical Physicist"
  },
  {
    text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
    author: "Albert Einstein",
    field: "Theoretical Physicist"
  },
  {
    text: "Knowledge is power. Information is liberating. Education is the premise of progress.",
    author: "Kofi Annan",
    field: "Diplomat & UN Secretary-General"
  },
  {
    text: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.",
    author: "Stephen Hawking",
    field: "Theoretical Physicist"
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    field: "Polymath & Founding Father"
  },
  {
    text: "Lock yourself away and study until you collapse, true brilliance comes from obsession",
    author: "Isaac Newton",
    field: "Father of Physics"
  }
];

export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}
