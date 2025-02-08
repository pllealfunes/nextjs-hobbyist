import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { id: 1, name: "Physical" },
    { id: 2, name: "Creative" },
    { id: 3, name: "Mental" },
    { id: 4, name: "Musical" },
    { id: 5, name: "Collecting" },
    { id: 6, name: "Games+Puzzles" },
  ];
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      name: "Bob Belcher", // Replace with the email of the user you want to find
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const creativeCategory = await prisma.category.findUnique({
    where: { name: "Creative" },
  });
  const physicalCategory = await prisma.category.findUnique({
    where: { name: "Physical" },
  });

  if (!creativeCategory || !physicalCategory) {
    throw new Error("One or more categories not found");
  }

  const posts = [
    {
      title: "The Future of AI",
      content: `
Exploring the advancements and ethical considerations of artificial intelligence has never been more critical. As we delve into the realms of AI, we find ourselves at the crossroads of innovation and ethical dilemmas. The potential of AI to revolutionize industries, enhance productivity, and improve our daily lives is immense. However, with great power comes great responsibility. We must address the ethical implications of AI, such as privacy concerns, bias in algorithms, and the potential for job displacement.

One of the most exciting developments in AI is its ability to process and analyze vast amounts of data at unprecedented speeds. This capability has led to breakthroughs in fields such as healthcare, where AI-powered diagnostic tools are transforming patient care. For instance, AI algorithms can analyze medical images with remarkable accuracy, aiding doctors in early detection and treatment of diseases. Furthermore, AI-driven drug discovery is accelerating the development of new treatments and therapies.

In the realm of autonomous vehicles, AI is paving the way for a future where self-driving cars are commonplace. These vehicles have the potential to reduce traffic accidents, decrease congestion, and provide greater mobility for individuals with disabilities. However, the ethical considerations surrounding autonomous vehicles are complex. Questions about liability in the event of accidents, the potential loss of jobs for professional drivers, and the security of AI systems must be addressed.

AI is also making significant strides in natural language processing (NLP), enabling machines to understand and generate human language. This has led to the creation of virtual assistants, chatbots, and translation services that are becoming increasingly sophisticated. As AI continues to evolve, we can expect even more seamless interactions between humans and machines. However, the ethical concerns surrounding data privacy, surveillance, and the misuse of AI-generated content must be carefully examined.

The future of AI is not without its challenges. One of the most pressing issues is the potential for bias in AI algorithms. If not addressed, biased algorithms can perpetuate and even exacerbate existing societal inequalities. It is crucial to ensure that AI systems are transparent, fair, and accountable. Researchers and policymakers must work together to establish guidelines and regulations that promote ethical AI development and deployment.

As we navigate the complexities of AI, it is essential to consider the impact on the workforce. While AI has the potential to automate repetitive tasks and increase efficiency, it also raises concerns about job displacement. Workers in industries such as manufacturing, transportation, and customer service may be particularly vulnerable. It is vital to invest in reskilling and upskilling programs to help workers transition to new roles in an AI-driven economy.

In conclusion, the future of AI is filled with promise and potential. By addressing the ethical considerations and embracing responsible AI development, we can harness the power of AI to create a better, more equitable world. The journey ahead is challenging, but with collaboration and innovation, we can shape a future where AI benefits all of humanity.

      `,
      categoryId: creativeCategory.id,
      authorId: user.id,
    },
    {
      title: "Healthy Eating Habits",
      content: `
Maintaining a balanced diet and healthy lifestyle is essential for overall well-being. Healthy eating habits can help prevent chronic diseases, boost energy levels, and improve mental health. In this comprehensive guide, we will explore various tips and tricks for achieving and maintaining a balanced diet.

The foundation of a healthy diet is based on the principles of variety, moderation, and balance. It is important to include a wide range of foods from different food groups to ensure that you get all the essential nutrients your body needs. Fruits, vegetables, whole grains, lean proteins, and healthy fats should all be part of your daily diet.

One of the key aspects of healthy eating is portion control. Eating the right portion sizes can help prevent overeating and promote weight management. It is essential to be mindful of serving sizes and avoid consuming large portions of high-calorie foods. Using smaller plates and bowls can help with portion control, as can measuring your food and keeping track of what you eat.

In addition to portion control, it is crucial to focus on nutrient-dense foods. These are foods that are rich in essential nutrients, such as vitamins, minerals, and antioxidants, but relatively low in calories. Examples of nutrient-dense foods include fruits, vegetables, whole grains, lean proteins, and healthy fats. Incorporating these foods into your diet can help you meet your nutritional needs without consuming excess calories.

Another important aspect of healthy eating is staying hydrated. Drinking plenty of water throughout the day is essential for maintaining proper bodily functions and overall health. Water helps regulate body temperature, aids digestion, and supports the transportation of nutrients and oxygen to cells. Aim to drink at least eight glasses of water a day, and more if you are physically active or live in a hot climate.

Mindful eating is a practice that can help you develop a healthier relationship with food. It involves paying attention to your body's hunger and fullness cues and eating with intention and awareness. By practicing mindful eating, you can avoid overeating, enjoy your meals more, and make healthier food choices. Some tips for mindful eating include eating slowly, savoring each bite, and avoiding distractions such as watching TV or using electronic devices while eating.

Planning and preparing your meals ahead of time can also support healthy eating habits. By taking the time to plan your meals, you can ensure that you have healthy options readily available and avoid the temptation to opt for unhealthy convenience foods. Meal prepping can involve preparing ingredients in advance, cooking in bulk, and portioning out meals for the week. This approach can save time, reduce stress, and help you stay on track with your healthy eating goals.

Incorporating physical activity into your daily routine is another important component of a healthy lifestyle. Regular exercise can help you maintain a healthy weight, improve cardiovascular health, and boost your mood. Aim to engage in at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous-intensity aerobic activity each week, along with muscle-strengthening activities on two or more days a week.

Finally, it is important to recognize that healthy eating is a journey, not a destination. It is normal to have occasional indulgences and setbacks, and it is essential to approach healthy eating with a positive mindset. Focus on making gradual, sustainable changes to your diet and lifestyle, and be patient with yourself as you work towards your goals.

In conclusion, healthy eating habits are essential for overall well-being. By incorporating a variety of nutrient-dense foods, practicing portion control, staying hydrated, and engaging in regular physical activity, you can achieve and maintain a balanced diet and healthy lifestyle. Remember that healthy eating is a lifelong journey, and it is important to be kind to yourself and enjoy the process of nourishing your body and mind.

      `,
      categoryId: physicalCategory.id,
      authorId: user.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log("Categories and posts seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
