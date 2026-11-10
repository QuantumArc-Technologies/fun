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
      // text can be one line, or a list of paragraphs
      // emoji: "..." under a photo shows it large, after the caption
      {
        when: "The first time",
        title: "A temple, and a little hand in yours",
        text: [
          "The first time I saw you was near that temple. You were walking past, holding a little child by the hand, and you had no idea someone had just stopped breathing for a second.",
          "Then came the long wait. And then Kota, where you finally held my hand. It still feels like yesterday.",
          "The film we watched there, the food we shared, every hour of those first days. That time is the most precious thing I own.",
          "I will not write all of it here. You remember. That is exactly what this page is for.",
        ],
        media: [
          { type: "photo", src: "media/first-days.jpg", caption: "About this photo, I do not need to say a single word.", emoji: "😉" },
        ],
      },
      // layout: "gallery" -> a wall of photos. thumb is the small copy shown on the wall,
      // src is the full picture she sees when she taps. w and h are the thumb's size.
      {
        layout: "gallery",
        when: "Through the years",
        title: "Every version of you, and of us",
        text: "Tap any photo to open it, then swipe.",
        media: [
          { type: "photo", src: "media/g-01.jpg", thumb: "media/thumb/g-01.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-02.jpg", thumb: "media/thumb/g-02.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-03.jpg", thumb: "media/thumb/g-03.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-04.jpg", thumb: "media/thumb/g-04.jpg", w: 288, h: 640, game: false },
          { type: "photo", src: "media/g-05.jpg", thumb: "media/thumb/g-05.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-06.jpg", thumb: "media/thumb/g-06.jpg", w: 560, h: 640, game: false },
          { type: "photo", src: "media/g-07.jpg", thumb: "media/thumb/g-07.jpg", w: 519, h: 640, game: false },
          { type: "photo", src: "media/g-08.jpg", thumb: "media/thumb/g-08.jpg", w: 640, h: 640, game: false },
          { type: "photo", src: "media/g-09.jpg", thumb: "media/thumb/g-09.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-10.jpg", thumb: "media/thumb/g-10.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-11.jpg", thumb: "media/thumb/g-11.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-12.jpg", thumb: "media/thumb/g-12.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-13.jpg", thumb: "media/thumb/g-13.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-14.jpg", thumb: "media/thumb/g-14.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-15.jpg", thumb: "media/thumb/g-15.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-16.jpg", thumb: "media/thumb/g-16.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-17.jpg", thumb: "media/thumb/g-17.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-18.jpg", thumb: "media/thumb/g-18.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-19.jpg", thumb: "media/thumb/g-19.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-20.jpg", thumb: "media/thumb/g-20.jpg", w: 469, h: 640, game: false },
          { type: "photo", src: "media/g-21.jpg", thumb: "media/thumb/g-21.jpg", w: 480, h: 640, game: false },
          { type: "photo", src: "media/g-22.jpg", thumb: "media/thumb/g-22.jpg", w: 640, h: 480, game: false },
        ],
      },
      // layout: "videos" -> videos in a row. One plays to the end, then the next slides in and plays.
      // poster is the still picture shown before a video starts.
      {
        layout: "videos",
        when: "And some that move",
        title: "Moments I keep replaying",
        media: [
          { type: "video", src: "media/v-1.mp4", poster: "media/v-1.jpg", w: 720, h: 1280 },
          { type: "video", src: "media/v-2.mp4", poster: "media/v-2.jpg", w: 720, h: 1280 },
        ],
      },
    ],
    letterTitle: "I am stopping here, on purpose",
    letter: [
      "There are so many more photos and videos. I have left them out for now. The rest we will see together, in person. Whenever a memory comes back to one of us, we will pull them all out and sit with them.",
      "I told this like an unfinished story so that you would remember the rest yourself. That is where all of it belongs: in our hearts.",
      // strong: true makes a line large and golden
      { text: "I love you, Achu Kuchu. Be with me, always.", strong: true },
      "This is my surprise for our ten years. Very, very late, I know.",
    ],
    signoff: "Yours, always",
  },
};
