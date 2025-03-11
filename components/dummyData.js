export const negotiations = [
    {
      id: 1,
      user: "Rahul Sharma",
      product: "Fresh Mangoes (1kg)",
      initialPrice: 120,
      negotiatedPrice: 110,
      avatar: "https://example.com/avatar1.jpg", // Replace with actual URL
      messages: [
        { sender: "user", message: "Can you do ₹110 per kg for the mangoes?" },
        { sender: "vendor", message: "Sure, I can do ₹110." },
      ],
    },
    {
      id: 2,
      user: "Aarti Patel",
      product: "Organic Wheat (10kg)",
      initialPrice: 450,
      negotiatedPrice: 420,
      avatar: "https://example.com/avatar2.jpg", // Replace with actual URL
      messages: [
        { sender: "user", message: "Would you consider ₹420 for the wheat?" },
        { sender: "vendor", message: "Yes, that works for me." },
      ],
    },
    {
      id: 3,
      user: "Vikram Singh",
      product: "Desi Ghee (1L)",
      initialPrice: 900,
      negotiatedPrice: null,
      avatar: "https://example.com/avatar3.jpg", // Replace with actual URL
      messages: [
        { sender: "user", message: "Can I get the ghee for ₹850?" },
      ],
    },
    {
      id: 4,
      user: "Neha Verma",
      product: "Basmati Rice (5kg)",
      initialPrice: 650,
      negotiatedPrice: 600,
      avatar: "https://example.com/avatar4.jpg", // Replace with actual URL
      messages: [
        { sender: "user", message: "Will you take ₹600 for the rice?" },
        { sender: "vendor", message: "Alright, deal!" },
      ],
    },
    {
      id: 5,
      user: "Arun Kumar",
      product: "Fresh Paneer (500g)",
      initialPrice: 200,
      negotiatedPrice: 180,
      avatar: "https://example.com/avatar5.jpg", // Replace with actual URL
      messages: [
        { sender: "user", message: "Can you reduce the price to ₹180?" },
        { sender: "vendor", message: "Alright, ₹180 it is!" },
      ],
    },
  ];
  