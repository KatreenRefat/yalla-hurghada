// src/data/FeatureRestaurantData.js

import restaurantHero from "../assets/hero-resturant.jpeg";

const baseData = [
  {
    id: 1,
    rating: 4.9,
    reviews: 312,
    priceLevel: "$$$",
    image: restaurantHero,
    features: [
      { icon: "utensils" }, { icon: "waves" }, { icon: "crown" },
      { icon: "music" }, { icon: "headset" }, { icon: "snowflake" },
    ],
    info: [
      { icon: "clock" }, { icon: "utensils" }, { icon: "star" }, { icon: "x-circle" },
    ],
  },
  {
    id: 2,
    rating: 4.7,
    reviews: 189,
    priceLevel: "$$",
    image: restaurantHero,
    features: [
      { icon: "utensils" }, { icon: "music" }, { icon: "crown" },
      { icon: "headset" }, { icon: "snowflake" }, { icon: "star" },
    ],
    info: [
      { icon: "clock" }, { icon: "utensils" }, { icon: "star" }, { icon: "x-circle" },
    ],
  },
  {
    id: 3,
    rating: 4.9,
    reviews: 241,
    priceLevel: "$$$",
    image: restaurantHero,
    features: [
      { icon: "utensils" }, { icon: "waves" }, { icon: "crown" },
      { icon: "headset" }, { icon: "snowflake" }, { icon: "star" },
    ],
    info: [
      { icon: "clock" }, { icon: "utensils" }, { icon: "star" }, { icon: "x-circle" },
    ],
  },
];

const translations = {
  EN: [
    {
      category: "Fine Dining", title: "The Red Sea Grill",
      location: "Marina Boulevard, Hurghada",
      description: "Award-winning seafood restaurant with panoramic Red Sea views. Enjoy fresh catches, a curated wine list, and world-class service in an elegant waterfront setting.",
      badges: ["Top Rated", "Ocean View"],
      features: ["Fine Dining", "Ocean View", "Award Winning", "Live Music", "Reservations", "Air Conditioned"],
      info: ["12:00 PM - 11:00 PM", "Seafood & International", "Top Rated", "Free Cancellation"],
    },
    {
      category: "Traditional", title: "Sahara Oasis Restaurant",
      location: "El Dahar, Hurghada",
      description: "Authentic Egyptian flavors in a traditional Bedouin tent setting. Experience the rich culture of Egypt with live oriental music and home-style dishes passed down through generations.",
      badges: ["Authentic", "Live Music"],
      features: ["Traditional", "Live Music", "Authentic", "Reservations", "Air Conditioned", "Local Favorite"],
      info: ["10:00 AM - 10:00 PM", "Egyptian & Middle Eastern", "Local Favorite", "Free Cancellation"],
    },
    {
      category: "Italian", title: "Bella Napoli",
      location: "Sahl Hasheesh, Hurghada",
      description: "Authentic Italian restaurant famous for handmade pasta and wood-fired pizza. Enjoy a stunning terrace overlooking the Red Sea while savoring classic Italian recipes.",
      badges: ["Top Rated", "Terrace"],
      features: ["Wood Fired", "Sea View", "Premium", "Reservations", "Air Conditioned", "Top Rated"],
      info: ["11:00 AM - 11:30 PM", "Italian & Mediterranean", "Top Rated", "Free Cancellation"],
    },
  ],
  AR: [
    {
      category: "مطعم فاخر", title: "مطعم البحر الأحمر",
      location: "شارع المارينا، الغردقة",
      description: "مطعم مأكولات بحرية حائز على جوائز مع إطلالة بانورامية على البحر الأحمر. استمتع بأطباق طازجة وقائمة نبيذ مختارة وخدمة عالمية المستوى.",
      badges: ["الأعلى تقييماً", "إطلالة على البحر"],
      features: ["مطعم فاخر", "إطلالة على البحر", "حائز على جوائز", "موسيقى حية", "حجز مسبق", "تكييف هواء"],
      info: ["12:00 ظهراً - 11:00 مساءً", "مأكولات بحرية ودولية", "الأعلى تقييماً", "إلغاء مجاني"],
    },
    {
      category: "تقليدي", title: "مطعم واحة الصحراء",
      location: "الدهار، الغردقة",
      description: "نكهات مصرية أصيلة في خيمة بدوية تقليدية. اختبر الثقافة المصرية الغنية مع موسيقى شرقية حية وأطباق منزلية متوارثة عبر الأجيال.",
      badges: ["أصيل", "موسيقى حية"],
      features: ["تقليدي", "موسيقى حية", "أصيل", "حجز مسبق", "تكييف هواء", "المفضل المحلي"],
      info: ["10:00 صباحاً - 10:00 مساءً", "مصري وشرق أوسطي", "المفضل المحلي", "إلغاء مجاني"],
    },
    {
      category: "إيطالي", title: "بيلا نابولي",
      location: "سهل حشيش، الغردقة",
      description: "مطعم إيطالي أصيل مشهور بالمعكرونة اليدوية والبيتزا المحمرة بالحطب. استمتع بتراس رائع يطل على البحر الأحمر.",
      badges: ["الأعلى تقييماً", "تراس"],
      features: ["فرن حطب", "إطلالة على البحر", "مميز", "حجز مسبق", "تكييف هواء", "الأعلى تقييماً"],
      info: ["11:00 صباحاً - 11:30 مساءً", "إيطالي ومتوسطي", "الأعلى تقييماً", "إلغاء مجاني"],
    },
  ],
  RU: [
    {
      category: "Изысканная кухня", title: "Гриль Красного моря",
      location: "Бульвар Марина, Хургада",
      description: "Отмеченный наградами ресторан морепродуктов с панорамным видом на Красное море. Наслаждайтесь свежими блюдами, изысканными винами и первоклассным обслуживанием.",
      badges: ["Высокий рейтинг", "Вид на океан"],
      features: ["Изысканная кухня", "Вид на океан", "Лауреат премий", "Живая музыка", "Бронирование", "Кондиционер"],
      info: ["12:00 - 23:00", "Морепродукты и интернациональная кухня", "Высокий рейтинг", "Бесплатная отмена"],
    },
    {
      category: "Традиционный", title: "Ресторан Сахара Оазис",
      location: "Эль-Дахар, Хургада",
      description: "Подлинные египетские блюда в традиционном бедуинском шатре. Погрузитесь в богатую культуру Египта с живой восточной музыкой и домашними блюдами.",
      badges: ["Аутентичный", "Живая музыка"],
      features: ["Традиционный", "Живая музыка", "Аутентичный", "Бронирование", "Кондиционер", "Любимый местными"],
      info: ["10:00 - 22:00", "Египетская и ближневосточная", "Любимый местными", "Бесплатная отмена"],
    },
    {
      category: "Итальянский", title: "Белла Наполи",
      location: "Сахл Хашиш, Хургада",
      description: "Аутентичный итальянский ресторан, известный домашней пастой и пиццей из дровяной печи. Наслаждайтесь видом на Красное море с великолепной террасы.",
      badges: ["Высокий рейтинг", "Терраса"],
      features: ["Дровяная печь", "Вид на море", "Премиум", "Бронирование", "Кондиционер", "Высокий рейтинг"],
      info: ["11:00 - 23:30", "Итальянская и средиземноморская", "Высокий рейтинг", "Бесплатная отмена"],
    },
  ],
};

export const getFeaturedRestaurantData = (language = "EN") => {
  const t = translations[language] || translations.EN;
  return baseData.map((item, i) => ({
    ...item,
    category: t[i].category,
    title: t[i].title,
    location: t[i].location,
    description: t[i].description,
    badges: t[i].badges,
    features: item.features.map((f, j) => ({ ...f, label: t[i].features[j] })),
    info: item.info.map((f, j) => ({ ...f, label: t[i].info[j] })),
  }));
};