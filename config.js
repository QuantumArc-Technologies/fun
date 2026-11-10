/* Everything you will want to change lives in this file.
   Names, questions, answers, messages, photos and videos. */

window.GIFT = {
  her: {
    // Any of these spellings is accepted (capital letters and spaces do not matter).
    names: ["aswathi"],
    display: "Aswathi",
  },
  // photo: your face for the catch game, for example "media/me.jpg". Empty shows your initial.
  him: { name: "Vaishakh", initial: "V", photo: "media/me.jpg" },

  intro: {
    title: "Something small, made for one person only",
    text: "If that person is you, there is a gift waiting at the end. You will have to earn it a little.",
    button: "Begin",
  },

  nameGate: {
    title: "First, who is this?",
    text: "Type your name. This page opens for exactly one girl.",
    button: "Let me in",
    empty: "Type your name first.",
    wrong: [
      "Nice try. Only one name opens this page, and that is not it.",
      "Hmm, no. Are you sure you are not her friend, peeking?",
      "Still no. Please hand the phone to the rightful owner.",
      "This page is very loyal. It is waiting for her and only her.",
    ],
    welcomeTitle: "There you are",
    welcomeText: "I was hoping it would be you. Now a few questions, just to be sure you are really mine.",
    welcomeButton: "Ask me anything",
  },

  // type: "choice" | "text" | "number" | "date"
  // choice -> answer is the exact option text
  // text   -> answer is a list of accepted spellings
  // number -> answer is a number
  // date   -> answer is "YYYY-MM-DD"
  // any: true     -> every option lets her through (nothing is blocked)
  // replies: {..} -> a different line for each option she picks
  questions: [
    {
      type: "choice",
      q: "Where did we first see each other?",
      options: ["At college", "At a wedding", "On Instagram", "At the bus stop"],
      answer: "On Instagram",
      yes: "One follow request, and here we are.",
    },
    {
      type: "choice",
      q: "Where do I live now?",
      options: ["In Kerala", "In my heart", "In my phone", "On another planet"],
      answer: "In my heart",
      yes: "Rent free, and never moving out.",
    },
    {
      type: "date",
      q: "What is our special date?",
      answer: "2016-07-13",
      yes: "13 July 2016. The best day on my calendar.",
    },
    {
      type: "number",
      q: "How many years have we been together?",
      answer: 10,
      yes: "Ten years, and it still feels like the beginning.",
    },
    {
      type: "choice",
      q: "Who said “I love you” first?",
      options: ["Me", "You", "We said it together", "Nobody remembers"],
      answer: "You",
      yes: "Guilty. I could not wait any longer.",
    },
    {
      type: "choice",
      q: "What was the first movie we watched together?",
      options: ["Raees", "Premam", "Charlie", "Bangalore Days"],
      answer: "Raees",
      any: true,
      yes: "Raees. Not that I saw much of the movie.",
      other: "It was Raees. But I will let it go, because neither of us was really watching.",
    },
    {
      type: "choice",
      q: "And while that movie was playing, did anything special happen in the dark?",
      options: ["Yes", "No"],
      any: true,
      replies: {
        Yes: "Good. Tell Vaishakh exactly what, when he calls. Slowly, and in detail.",
        No: "No? Vaishakh remembers it very differently. Explain yourself when he calls.",
      },
    },
    {
      type: "text",
      q: "What do I call you most?",
      answer: ["achu"],
      yes: "Achu. My favourite word to say.",
    },
    {
      type: "choice",
      q: "Who gets angry first?",
      options: ["Me, obviously", "You, always", "Both of us, exactly the same", "We never fight"],
      answer: "Both of us, exactly the same",
      yes: "Two short fuses, one long love story.",
    },
    {
      type: "choice",
      q: "Who loves the other one more?",
      options: ["I do", "You do", "Both of us, exactly the same", "Still under investigation"],
      answer: "Both of us, exactly the same",
      yes: "Equal, always. That is why it works.",
    },
  ],
  quizWrong: [
    "Ayyo, no. Think again.",
    "Wrong. I am pretending I did not see that.",
    "Not that one. You know this.",
    "Hmm. Should I be worried? Try again.",
  ],
  quizDone: {
    title: "You know us by heart",
    text: "Every answer right. Now come and catch me, if you can.",
    button: "Catch him",
  },

  catchGame: {
    title: "Catch me",
    text: "Tap me before I run away.",
    target: 8,
    teases: ["Too slow", "Almost", "Over here", "Missed me", "Try again", "So close"],
    caught: ["Got me", "Again", "Okay, okay", "You are fast", "Caught"],
    doneTitle: "You caught me",
    doneText: "You always do. One more little game, then we are nearly there.",
    doneButton: "Next game",
  },

  matchGame: {
    title: "Find the pairs",
    text: "Turn two cards at a time and match our moments.",
    doneTitle: "Every pair found",
    doneText: "Like us. One last question before your gift.",
    doneButton: "Ask me",
  },

  love: {
    title: "How much do you love me?",
    text: "Choose honestly.",
    options: ["25%", "50%", "75%", "100%"],
    answer: "100%",
    dodges: [
      "That one is shy.",
      "No no, not that.",
      "It ran away. Strange.",
      "Try a bigger number.",
      "You cannot catch a wrong answer.",
    ],
    yes: "I knew it.",
  },

  heart: {
    title: "You did everything right",
    text: "So here it is. My heart is open, and what is inside is yours.",
    button: "Open my heart",
  },

  // The gift. Put your files in the media folder and write the path in src,
  // for example src: "media/first-day.jpg". An empty src shows a placeholder.
  story: {
    title: "Ten years of us",
    intro: "After ten years, I have nothing grand to give you. So I made you this instead: a small new world with our story inside it. Read it like a love letter.",
    // fit: "tall"  -> shows the whole picture, uncropped (good for phone screenshots)
    // game: false  -> keeps the picture out of the pairs game
    chapters: [
      {
        when: "12 July 2016",
        title: "It began with a random “Hi”",
        text: "I sent one small message to a girl on Instagram I had never met. Then a “Hey”. The next day she wrote back: “Sorry for asking. But do I know you?” You did not, then. Ten years later, nobody on this earth knows me better.",
        media: [
          { type: "photo", src: "media/2016-first-message.jpg", caption: "Where it all started.", fit: "tall", game: false },
        ],
      },
      // layout: "carousel" -> photos slide past one by one, on their own or by swiping
      {
        layout: "carousel",
        media: [
          { type: "photo", src: "media/early-1.jpg" },
          { type: "photo", src: "media/early-2.jpg" },
          { type: "photo", src: "media/early-3.jpg" },
          { type: "photo", src: "media/early-4.jpg" },
          { type: "photo", src: "media/early-5.jpg" },
          { type: "photo", src: "media/early-6.jpg" },
          { type: "photo", src: "media/early-7.jpg" },
        ],
      },
      {
        when: "2021",
        title: "Becoming us",
        text: "Long calls, small fights, bigger laughs. Write what this year meant to you two.",
        media: [
          { type: "video", src: "", caption: "A video from that trip" },
          { type: "photo", src: "", caption: "Our first trip" },
          { type: "photo", src: "", caption: "Your favourite place" },
        ],
      },
      {
        when: "2023",
        title: "The days I love most",
        text: "The ordinary ones. Tea, rain, your head on my shoulder. Write your own here.",
        media: [
          { type: "photo", src: "", caption: "An ordinary, perfect day" },
          { type: "photo", src: "", caption: "You, laughing" },
          { type: "video", src: "", caption: "A video that makes me smile" },
        ],
      },
      {
        when: "Today",
        title: "And everything still to come",
        text: "So many pages left to fill. I want to fill every one of them with you.",
        media: [
          { type: "photo", src: "", caption: "My favourite picture of us" },
        ],
      },
    ],
    letterTitle: "One last thing",
    letter: [
      "Thank you for every year, every call, every silly fight and every time you chose me again.",
      "This page is small. What I feel for you is not.",
    ],
    signoff: "Yours, always",
  },
};
