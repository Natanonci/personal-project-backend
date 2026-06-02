import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log('Start seeding...');

  // ⚠️ สำคัญมาก: เพื่อไม่ให้เกิด Error Foreign Key
  // เราต้องเช็คก่อนว่ามี User สำหรับเป็นเจ้าของร้าน (owner_id) หรือยัง 
  // ถ้ายังไม่มี ระบบจะสร้าง User จำลองให้ 1 คนครับ
  let defaultOwner = await prisma.user.findFirst();
  if (!defaultOwner) {
    defaultOwner = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "Owner",
        email: "admin_owner@test.com",
        password: "hashed_password_here", // จำลองรหัสผ่าน
        role: "OWNER"
      }
    });
    console.log(`Created default owner with id: ${defaultOwner.id}`);
  }

  const ownerId = defaultOwner.id;

  const storeData = [
    {
      store_type: "Cat Cafe",
      store_name: "Caturday Cat Cafe",
      pet_type: "Cat",
      total_storeentry: 30,
      total_table: 12,
      total_pet: 25,
      summary: "คาเฟ่แมวสุดฮิตใจกลางเมือง เดินทางสะดวก แหล่งรวมแก๊งแมวอ้วนกลม ขี้อ้อน และเป็นมิตร",
      address: "โครงการ Coco Walk, ถ.พญาไท ราชเทวี กรุงเทพมหานคร",
      price: 200,
      open_datetime: "Tue-Sun 12:00-21:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/cat?lock=1"
    },
    {
      store_type: "Dog Cafe",
      store_name: "TrueLove at Neverland",
      pet_type: "Siberian Husky",
      total_storeentry: 50,
      total_table: 20,
      total_pet: 30,
      summary: "สวรรค์ของคนรักไซบีเรียนฮัสกี้! คาเฟ่ที่มีน้องหมายักษ์ใจดีรอต้อนรับกว่า 30 ตัว มีรอบปล่อยเป็นเวลา",
      address: "153 ซอยอารีย์สัมพันธ์ 2, พญาไท กรุงเทพมหานคร",
      price: 350,
      open_datetime: "Mon-Sun 12:00-17:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/dog?lock=1"
    },
    {
      store_type: "Exotic Pet Cafe",
      store_name: "Little Zoo Cafe",
      pet_type: "Exotic Animals (Fox, Raccoon, Meerkat)",
      total_storeentry: 40,
      total_table: 15,
      total_pet: 15,
      summary: "คาเฟ่สัตว์แปลกสุดคิวท์ พบกับน้องจิ้งจอกแรคคูน เมียร์แคท และคอร์กี้สุดแสบ",
      address: "420 สยามสแควร์ ซอย 11, ปทุมวัน กรุงเทพมหานคร",
      price: 390,
      open_datetime: "Mon-Sun 11:00-20:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/raccoon?lock=1"
    },
    {
      store_type: "Mixed Pet Cafe",
      store_name: "Fluff & Paws Community",
      pet_type: "Cat & Dog",
      total_storeentry: 20,
      total_table: 8,
      total_pet: 12,
      summary: "คาเฟ่ไซส์มินิบรรยากาศโฮมมี่ มีทั้งแก๊งน้องแมวและน้องหมาพันธุ์เล็กคอยเอนเตอร์เทน",
      address: "ซอยลาดพร้าว 71, วังทองหลาง กรุงเทพมหานคร",
      price: 150,
      open_datetime: "Wed-Mon 10:00-19:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/pets?lock=1"
    },
    {
      store_type: "Cat Cafe",
      store_name: "Mohu Mohu Cat Cafe",
      pet_type: "Cat",
      total_storeentry: 25,
      total_table: 10,
      total_pet: 20,
      summary: "คาเฟ่แมวจรที่ได้รับการช่วยเหลือมา ทุกตัวเชื่องและน่ารักมาก บรรยากาศอบอุ่นสไตล์ญี่ปุ่น",
      address: "ซอยลาดพร้าว 26, จตุจักร กรุงเทพมหานคร",
      price: 200,
      open_datetime: "Tue-Sun 12:00-20:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/cat?lock=2"
    },
    {
      store_type: "Dog Cafe",
      store_name: "Dog In Town",
      pet_type: "Mixed Dog Breeds",
      total_storeentry: 35,
      total_table: 15,
      total_pet: 18,
      summary: "คาเฟ่หมาใจกลางเอกมัย มีน้องหมาหลากหลายสายพันธุ์ ตั้งแต่คอร์กี้ ซามอยด์ ยันเฟรนช์บูลด็อก",
      address: "16/1 ซอยเอกมัย 6, วัฒนา กรุงเทพมหานคร",
      price: 300,
      open_datetime: "Sun-Thu 11:00-20:00, Fri-Sat 11:00-21:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/dog?lock=2"
    },
    {
      store_type: "Exotic Pet Cafe",
      store_name: "The Animal Cafe",
      pet_type: "Exotic (Caracal cat, Fennec fox, Owl)",
      total_storeentry: 30,
      total_table: 12,
      total_pet: 10,
      summary: "ร้านอาหารและคาเฟ่กึ่งสวนสัตว์ขนาดย่อม มีสัตว์ป่าหายากให้ชมและถ่ายรูปอย่างใกล้ชิด",
      address: "ซอยสาธุประดิษฐ์ 19, ยานนาวา กรุงเทพมหานคร",
      price: 400,
      open_datetime: "Mon-Sun 11:00-20:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/owl?lock=1"
    },
    {
      store_type: "Dog Cafe",
      store_name: "Big Dog Cafe",
      pet_type: "Large Dog Breeds (Malamute, Chow Chow)",
      total_storeentry: 60,
      total_table: 25,
      total_pet: 25,
      summary: "เอาใจคนรักน้องหมาพันธุ์ใหญ่ไซส์ยักษ์ ขนฟู กอดอุ่น พื้นที่กว้างขวางวิ่งเล่นได้เต็มที่",
      address: "ถนนรัชดาภิเษก, ดินแดง กรุงเทพมหานคร",
      price: 350,
      open_datetime: "Mon-Sun 10:00-19:30",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/dog?lock=3"
    },
    {
      store_type: "Rabbit Cafe",
      store_name: "Rabbito Cafe",
      pet_type: "Rabbit & Guinea Pig",
      total_storeentry: 20,
      total_table: 8,
      total_pet: 30,
      summary: "คาเฟ่กระต่ายสุดนุ่มฟู ป้อนอาหารและลูบคลำน้องกระต่ายสายพันธุ์ต่างๆ ได้อย่างใกล้ชิด",
      address: "สุขุมวิท 101/1, พระโขนง กรุงเทพมหานคร",
      price: 150,
      open_datetime: "Tue-Sun 12:00-19:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/rabbit?lock=1"
    },
    {
      store_type: "Dog Cafe",
      store_name: "Corgi in the Garden",
      pet_type: "Corgi",
      total_storeentry: 40,
      total_table: 15,
      total_pet: 16,
      summary: "อาณาจักรของคนรักคอร์กี้ พบกับขบวนพาเหรดก้นดุ๊กดิ๊กกว่าสิบชีวิตในสวนสวย",
      address: "ถนนกัลปพฤกษ์, ภาษีเจริญ กรุงเทพมหานคร",
      price: 350,
      open_datetime: "Tue-Sun 12:30-18:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/corgi?lock=1"
    },
    {
      store_type: "Cat Cafe",
      store_name: "Catmosphere Cafe",
      pet_type: "Cat",
      total_storeentry: 25,
      total_table: 10,
      total_pet: 18,
      summary: "คาเฟ่แมวธีมอวกาศแห่งแรกของไทย น้องแมวทุกตัวมีชื่อเป็นกระสวยอวกาศและดวงดาว",
      address: "ถนนห้วยแก้ว, เมือง เชียงใหม่",
      price: 200,
      open_datetime: "Mon-Sun 10:00-20:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/cat?lock=3"
    },
    {
      store_type: "Bird Cafe",
      store_name: "Happy Avian Cafe",
      pet_type: "Parrots & Exotic Birds",
      total_storeentry: 20,
      total_table: 10,
      total_pet: 40,
      summary: "สัมผัสความน่ารักและสีสันสดใสของนกแก้วมาคอว์ ค็อกคาเทล และนกสายพันธุ์อื่นๆ",
      address: "ซอยรามอินทรา 109, คลองสามวา กรุงเทพมหานคร",
      price: 180,
      open_datetime: "Wed-Sun 10:00-18:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/parrot?lock=1"
    },
    {
      store_type: "Mixed Pet Cafe",
      store_name: "Petaholic Cafe",
      pet_type: "Cat, Dog & Small Pets",
      total_storeentry: 30,
      total_table: 12,
      total_pet: 22,
      summary: "คาเฟ่สำหรับคนรักสัตว์ทุกชนิด โซนแยกชัดเจน สะอาด ปลอดภัย",
      address: "ถนนแจ้งวัฒนะ, ปากเกร็ด นนทบุรี",
      price: 250,
      open_datetime: "Mon-Sun 11:00-21:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/pets?lock=2"
    },
    {
      store_type: "Cat Cafe",
      store_name: "Poolcat Cafe & Spa",
      pet_type: "Cat",
      total_storeentry: 35,
      total_table: 14,
      total_pet: 28,
      summary: "นอกจากจะเป็นคาเฟ่แล้ว ยังมีบริการสปาและอาบน้ำแมวโดยเฉพาะ",
      address: "ซอยสุขุมวิท 39, วัฒนา กรุงเทพมหานคร",
      price: 250,
      open_datetime: "Mon-Sun 09:00-20:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/cat?lock=4"
    },
    {
      store_type: "Mini Pig Cafe",
      store_name: "Piggy Village",
      pet_type: "Mini Pig",
      total_storeentry: 20,
      total_table: 8,
      total_pet: 10,
      summary: "คาเฟ่หมูแคระแห่งแรก! มาป้อนนมน้องหมูสุดน่ารักและฉลาดแสนรู้",
      address: "สายไหม, กรุงเทพมหานคร",
      price: 150,
      open_datetime: "Sat-Sun 10:00-18:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/piglet?lock=1"
    },
    {
      store_type: "Dog Cafe",
      store_name: "Hucky's Friends",
      pet_type: "Siberian Husky & Samoyed",
      total_storeentry: 45,
      total_table: 18,
      total_pet: 20,
      summary: "รวมพลหมาหิมะขนฟู แอร์เย็นฉ่ำ เหมาะกับการพักผ่อนในวันหยุด",
      address: "ถนนราชพฤกษ์, ตลิ่งชัน กรุงเทพมหานคร",
      price: 300,
      open_datetime: "Tue-Sun 11:00-20:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/husky?lock=1"
    },
    {
      store_type: "Exotic Pet Cafe",
      store_name: "Reptile Room",
      pet_type: "Snake, Lizard, Turtle",
      total_storeentry: 15,
      total_table: 6,
      total_pet: 25,
      summary: "คาเฟ่สำหรับสายคลู พบกับสัตว์เลื้อยคลานหายาก กิ้งก่าสีสวย และงูไม่มีพิษ",
      address: "ซอยทองหล่อ 10, วัฒนา กรุงเทพมหานคร",
      price: 200,
      open_datetime: "Wed-Sun 13:00-22:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/reptile?lock=1"
    },
    {
      store_type: "Cat Cafe",
      store_name: "Meow Meow Wonderland",
      pet_type: "Munchkin & Scottish Fold",
      total_storeentry: 40,
      total_table: 16,
      total_pet: 30,
      summary: "เน้นน้องแมวขาสั้นและหูพับสุดคิวท์ ร้านตกแต่งธีมปราสาทดิสนีย์",
      address: "ถนนเพชรเกษม, บางแค กรุงเทพมหานคร",
      price: 280,
      open_datetime: "Mon-Sun 10:00-21:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/kitten?lock=1"
    },
    {
      store_type: "Rabbit Cafe",
      store_name: "Bunny Space",
      pet_type: "Rabbit",
      total_storeentry: 25,
      total_table: 10,
      total_pet: 35,
      summary: "พื้นที่กว้างขวางให้น้องกระต่ายวิ่งเล่น มีเมนูอาหารคลีนสำหรับคนรักสุขภาพ",
      address: "ซอยอารีย์ 4, พญาไท กรุงเทพมหานคร",
      price: 180,
      open_datetime: "Tue-Sun 11:00-19:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/rabbit?lock=2"
    },
    {
      store_type: "Exotic Pet Cafe",
      store_name: "Safari Paws",
      pet_type: "Alpaca, Capybara",
      total_storeentry: 60,
      total_table: 25,
      total_pet: 15,
      summary: "ไม่ต้องไปไกลถึงสวนสัตว์ใหญ่ ก็เจอน้องอัลปาก้าและคาปิบาร่าได้ที่นี่",
      address: "ถนนพระราม 2, บางขุนเทียน กรุงเทพมหานคร",
      price: 450,
      open_datetime: "Mon-Sun 09:00-18:00",
      owner_id: ownerId,
      url: "https://loremflickr.com/800/600/alpaca?lock=1"
    }
  ];

  // สั่งบันทึกข้อมูลทั้งหมดลง Database (ข้ามข้อมูลที่ซ้ำถ้ามี)
  await prisma.store.createMany({
    data: storeData,
  });

  console.log('Seeding finished. Added 20 stores!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });