export const tabs = {
  EN: ["Tours", "hotels", "Restaurants", "Transport"],
  AR: ["جولات", "فنادق", "مطاعم", "مواصلات"],
  RU: ["Туры", "Отели", "Рестораны", "Транспорт"],
};

export const searchFields = {
  EN: {
    Tours: [
      { icon: "FiMapPin", label: "Location", value: "Hurghada" },
      { icon: "FiTruck", label: "Service", value: "Select Service" },
      { icon: "FiStar", label: "Rating", value: "4.5+" },
    ],
    hotels: [
      { icon: "FiDollarSign", label: "Price", value: "$50 - $500" },
      { icon: "FiStar", label: "Star", value: "5 Stars" },
      { icon: "FiThumbsUp", label: "Review", value: "Excellent" },
    ],
    Restaurants: [
      { icon: "FiThumbsUp", label: "Recommended", value: "Top Rated" },
      { icon: "FiStar", label: "Star", value: "4.5+" },
      { icon: "FiCoffee", label: "Type", value: "Fine Dining" },
    ],
    Transport: [
      { icon: "FiDollarSign", label: "Price", value: "$20 - $200" },
      { icon: "FiTruck", label: "Type", value: "Private Car" },
      { icon: "FiThumbsUp", label: "Recommended", value: "Best Value" },
    ],
  },
  AR: {
    جولات: [
      { icon: "FiMapPin", label: "الموقع", value: "الغردقة" },
      { icon: "FiTruck", label: "الخدمة", value: "اختر خدمة" },
      { icon: "FiStar", label: "التقييم", value: "4.5+" },
    ],
    فنادق: [
      { icon: "FiDollarSign", label: "السعر", value: "$50 - $500" },
      { icon: "FiStar", label: "النجوم", value: "5 نجوم" },
      { icon: "FiThumbsUp", label: "التقييم", value: "ممتاز" },
    ],
    مطاعم: [
      { icon: "FiThumbsUp", label: "موصى به", value: "الأعلى تقييماً" },
      { icon: "FiStar", label: "النجوم", value: "4.5+" },
      { icon: "FiCoffee", label: "النوع", value: "مطاعم فاخرة" },
    ],
    مواصلات: [
      { icon: "FiDollarSign", label: "السعر", value: "$20 - $200" },
      { icon: "FiTruck", label: "النوع", value: "سيارة خاصة" },
      { icon: "FiThumbsUp", label: "موصى به", value: "أفضل قيمة" },
    ],
  },
  RU: {
    Туры: [
      { icon: "FiMapPin", label: "Локация", value: "Хургада" },
      { icon: "FiTruck", label: "Услуга", value: "Выберите услугу" },
      { icon: "FiStar", label: "Рейтинг", value: "4.5+" },
    ],
    Отели: [
      { icon: "FiDollarSign", label: "Цена", value: "$50 - $500" },
      { icon: "FiStar", label: "Звёзды", value: "5 звёзд" },
      { icon: "FiThumbsUp", label: "Отзыв", value: "Отлично" },
    ],
    Рестораны: [
      { icon: "FiThumbsUp", label: "Рекомендуем", value: "Лучший рейтинг" },
      { icon: "FiStar", label: "Звёзды", value: "4.5+" },
      { icon: "FiCoffee", label: "Тип", value: "Высокая кухня" },
    ],
    Транспорт: [
      { icon: "FiDollarSign", label: "Цена", value: "$20 - $200" },
      { icon: "FiTruck", label: "Тип", value: "Личный автомобиль" },
      { icon: "FiThumbsUp", label: "Рекомендуем", value: "Лучшая цена" },
    ],
  },
};

export const stats = {
  EN: [
    { icon: "HiOutlineUserGroup", number: "15K+", label: "Happy Travelers" },
    { icon: "HiOutlineMap", number: "200+", label: "Tour Packages" },
    { icon: "HiOutlineBuildingOffice2", number: "50+", label: "Partner hotels" },
    { icon: "HiOutlineShieldCheck", number: "99%", label: "Satisfaction" },
  ],
  AR: [
    { icon: "HiOutlineUserGroup", number: "15K+", label: "مسافر سعيد" },
    { icon: "HiOutlineMap", number: "200+", label: "باقة سياحية" },
    { icon: "HiOutlineBuildingOffice2", number: "50+", label: "فندق شريك" },
    { icon: "HiOutlineShieldCheck", number: "99%", label: "رضا العملاء" },
  ],
  RU: [
    { icon: "HiOutlineUserGroup", number: "15K+", label: "Довольных туристов" },
    { icon: "HiOutlineMap", number: "200+", label: "Турпакетов" },
    { icon: "HiOutlineBuildingOffice2", number: "50+", label: "Партнёрских отелей" },
    { icon: "HiOutlineShieldCheck", number: "99%", label: "Удовлетворённость" },
  ],
};