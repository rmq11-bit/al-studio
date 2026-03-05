import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const photographers = [
  {
    name: 'أحمد الرشيدي',
    email: 'ahmed@studio.sa',
    bio: 'مصور أفراح ومناسبات بخبرة 10 سنوات. متخصص في التقاط أجمل اللحظات وتحويلها إلى ذكريات لا تُنسى.',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    hourlyRate: 500,
    specialties: ['WEDDINGS_EVENTS', 'COMMERCIAL_EVENTS'],
    location: 'الرياض',
    media: [
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'حفل زفاف فاخر', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', caption: 'لحظة العقد', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', caption: 'بورتريه العروسين', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', caption: 'تصوير حفل الخطوبة', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', caption: 'أجواء الحفل', type: 'IMAGE' },
    ],
    availability: ['2025-02-10', '2025-02-12', '2025-02-15', '2025-02-18', '2025-02-20'],
  },
  {
    name: 'سارة الزهراني',
    email: 'sara@studio.sa',
    bio: 'مصورة تجارية ومحتوى UGC. أساعد العلامات التجارية على إبراز منتجاتها بأسلوب عصري وجذاب.',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    hourlyRate: 400,
    specialties: ['COMMERCIAL_MODEL_UGC_PRODUCTS', 'COMMERCIAL_EVENTS'],
    location: 'جدة',
    media: [
      { url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', caption: 'تصوير أزياء', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800', caption: 'جلسة تصوير ملابس', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800', caption: 'تصوير منتجات', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', caption: 'تصوير موضة', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800', caption: 'بورتريه تجاري', type: 'IMAGE' },
    ],
    availability: ['2025-02-11', '2025-02-13', '2025-02-16', '2025-02-19'],
  },
  {
    name: 'خالد العتيبي',
    email: 'khalid@studio.sa',
    bio: 'مصور سينمائي ومخرج فيديو. أتخصص في إنتاج المحتوى السينمائي عالي الجودة للأفلام القصيرة والإعلانات.',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    hourlyRate: 800,
    specialties: ['CINEMATIC', 'GOVERNMENT_SHOWS'],
    location: 'الرياض',
    media: [
      { url: 'https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=800', caption: 'تصوير سينمائي', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', caption: 'خلف الكواليس', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', caption: 'معدات التصوير', type: 'IMAGE' },
    ],
    availability: ['2025-02-14', '2025-02-17', '2025-02-21', '2025-02-25'],
  },
  {
    name: 'نورة الغامدي',
    email: 'noura@studio.sa',
    bio: 'مصورة فعاليات تجارية ومؤتمرات. خبرة واسعة في توثيق الفعاليات الكبرى والمهرجانات.',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    hourlyRate: 350,
    specialties: ['COMMERCIAL_EVENTS', 'WEDDINGS_EVENTS'],
    location: 'الدمام',
    media: [
      { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', caption: 'مؤتمر تجاري', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', caption: 'فعالية شركة', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', caption: 'معرض تجاري', type: 'IMAGE' },
    ],
    availability: ['2025-02-10', '2025-02-15', '2025-02-22', '2025-02-27'],
  },
  {
    name: 'محمد الحربي',
    email: 'mohammed@studio.sa',
    bio: 'مصور جوال محترف ومحتوى رقمي. أثبت أن الهاتف بيد المحترف يصنع فناً حقيقياً.',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    hourlyRate: 200,
    specialties: ['MOBILE', 'COMMERCIAL_MODEL_UGC_PRODUCTS'],
    location: 'مكة المكرمة',
    media: [
      { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', caption: 'تصوير بالجوال', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800', caption: 'صورة جوال إبداعية', type: 'IMAGE' },
    ],
    availability: ['2025-02-11', '2025-02-14', '2025-02-18', '2025-02-24', '2025-02-26'],
  },
  {
    name: 'فاطمة الشمسي',
    email: 'fatima@studio.sa',
    bio: 'مصورة عروض حكومية وفعاليات رسمية. خبرة في توثيق الأحداث الوطنية والمبادرات الحكومية الكبرى.',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    hourlyRate: 600,
    specialties: ['GOVERNMENT_SHOWS', 'COMMERCIAL_EVENTS'],
    location: 'الرياض',
    media: [
      { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800', caption: 'عرض وطني', type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', caption: 'مبادرة حكومية', type: 'IMAGE' },
    ],
    availability: ['2025-02-12', '2025-02-16', '2025-02-20', '2025-02-23'],
  },
]

// ── Payment-flow test account (TRIAL status → can test full subscribe flow) ──
// Login: yousuf@studio.sa / password123
// Go to /pricing → click Subscribe → use DEV confirm button → ACTIVE
const trialPhotographer = {
  name: 'يوسف التجريبي',
  email: 'yousuf@studio.sa',
  bio: 'حساب تجريبي لاختبار تدفق الاشتراك.',
  avatarUrl: 'https://i.pravatar.cc/150?img=60',
  hourlyRate: 300,
  specialties: ['WEDDINGS_EVENTS'],
  location: 'الرياض',
}

const consumers = [
  {
    name: 'عبدالله العمري',
    email: 'abdullah@example.sa',
    bio: 'صاحب شركة فعاليات وأبحث عن مصورين محترفين لتوثيق مشاريعنا.',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'ريم السالم',
    email: 'reem@example.sa',
    bio: 'مدير تسويق في شركة كبرى ومهتمة بتصوير المحتوى التجاري.',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
  },
]

async function main() {
  console.log('🌱 بدء تعبئة البيانات...')

  // Clear everything (children cascade from parents)
  await prisma.paymentIntent.deleteMany()
  await prisma.subscriptionTransaction.deleteMany()
  await prisma.bid.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.projectPost.deleteMany()
  await prisma.directRequest.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.media.deleteMany()
  await prisma.photographerProfile.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('password123', 10)

  // ── Photographers ─────────────────────────────────────────────────────
  const createdPhotographers: any[] = []
  for (const ph of photographers) {
    const user = await prisma.user.create({
      data: {
        role: 'PHOTOGRAPHER',
        name: ph.name,
        email: ph.email,
        passwordHash: password,
        avatarUrl: ph.avatarUrl,
        bio: ph.bio,
        photographerProfile: {
          create: {
            hourlyRate: ph.hourlyRate,
            specialties: JSON.stringify(ph.specialties),
            location: ph.location,
            isActive: true,
            subscriptionStatus: 'ACTIVE',
            media: { create: ph.media.map(m => ({ type: m.type, url: m.url, caption: m.caption })) },
            availability: { create: ph.availability.map(date => ({ date, status: 'AVAILABLE' })) },
          },
        },
      },
      include: { photographerProfile: true },
    })
    createdPhotographers.push(user)
    console.log(`  ✅ مصور: ${ph.name}`)
  }

  // ── Trial photographer (for payment-flow testing) ─────────────────────────
  await prisma.user.create({
    data: {
      role: 'PHOTOGRAPHER',
      name: trialPhotographer.name,
      email: trialPhotographer.email,
      passwordHash: password,
      avatarUrl: trialPhotographer.avatarUrl,
      bio: trialPhotographer.bio,
      photographerProfile: {
        create: {
          hourlyRate: trialPhotographer.hourlyRate,
          specialties: JSON.stringify(trialPhotographer.specialties),
          location: trialPhotographer.location,
          isActive: true,
          subscriptionStatus: 'TRIAL', // intentionally not ACTIVE — test /pricing → subscribe
        },
      },
    },
  })
  console.log(`  ✅ مصور تجريبي: ${trialPhotographer.name} (TRIAL)`)

  // ── Consumers ─────────────────────────────────────────────────────────
  const createdConsumers: any[] = []
  for (const c of consumers) {
    const user = await prisma.user.create({
      data: { role: 'CONSUMER', name: c.name, email: c.email, passwordHash: password, avatarUrl: c.avatarUrl, bio: c.bio },
    })
    createdConsumers.push(user)
    console.log(`  ✅ عميل: ${c.name}`)
  }

  // ── Projects ──────────────────────────────────────────────────────────
  const createdProjects: any[] = []
  for (const p of [
    { consumerId: createdConsumers[0].id, title: 'تصوير حفل زفاف فاخر في الرياض', description: 'نبحث عن مصور محترف لتوثيق حفل زفاف فاخر في قاعة كبرى بالرياض.', hours: 8 },
    { consumerId: createdConsumers[0].id, title: 'تصوير منتجات لمتجر إلكتروني', description: 'لدينا 50 منتجاً بحاجة لتصوير احترافي على خلفية بيضاء وبأسلوب lifestyle.', hours: 6 },
    { consumerId: createdConsumers[1].id, title: 'تصوير إطلاق منتج جديد', description: 'شركتنا تطلق منتجاً جديداً وبحاجة لمصور لتوثيق الحدث بالكامل.', hours: 5 },
  ]) {
    createdProjects.push(await prisma.projectPost.create({ data: p }))
    console.log(`  ✅ مشروع: ${p.title}`)
  }

  // ── Bids ──────────────────────────────────────────────────────────────
  await prisma.bid.createMany({
    data: [
      { projectId: createdProjects[0].id, photographerId: createdPhotographers[0].photographerProfile.id, price: 4000, message: 'لدي خبرة 10 سنوات في تصوير الأفراح.' },
      { projectId: createdProjects[0].id, photographerId: createdPhotographers[3].photographerProfile.id, price: 2800, message: 'متخصصة في الفعاليات وأقدم حزمة شاملة.' },
      { projectId: createdProjects[1].id, photographerId: createdPhotographers[1].photographerProfile.id, price: 2400, message: 'مصورة منتجات محترفة مع استوديو مجهز.' },
      { projectId: createdProjects[1].id, photographerId: createdPhotographers[4].photographerProfile.id, price: 1200, message: 'تصوير منتجات عالي الجودة بسعر تنافسي.' },
      { projectId: createdProjects[2].id, photographerId: createdPhotographers[5].photographerProfile.id, price: 3000, message: 'خبرتي في الفعاليات الرسمية تؤهلني لهذا العمل.' },
    ],
  })
  console.log('  ✅ العروض')

  // ── Direct Requests ───────────────────────────────────────────────────
  const directReq1 = await prisma.directRequest.create({
    data: {
      consumerId: createdConsumers[0].id,
      photographerId: createdPhotographers[0].photographerProfile.id,
      date: '2025-02-18', hours: 6,
      notes: 'نريدك لتصوير حفل خطوبة عائلي بسيط في المنزل.',
      status: 'PENDING',
    },
  })
  await prisma.directRequest.create({
    data: {
      consumerId: createdConsumers[1].id,
      photographerId: createdPhotographers[2].photographerProfile.id,
      date: '2025-02-21', hours: 4,
      notes: 'فيديو قصير للشركة بأسلوب سينمائي لموقعنا الإلكتروني.',
      status: 'APPROVED',
    },
  })
  console.log('  ✅ الطلبات المباشرة')

  // ── Conversation 1: DIRECT_REQUEST ────────────────────────────────────
  // عبدالله ←→ أحمد الرشيدي
  const conv1 = await prisma.conversation.create({
    data: {
      type: 'DIRECT_REQUEST',
      consumerId: createdConsumers[0].id,
      photographerId: createdPhotographers[0].photographerProfile.id,
      directRequestId: directReq1.id,
    },
  })
  const t1base = Date.now() - 1000 * 60 * 120
  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id, senderId: createdConsumers[0].id, senderRole: 'CLIENT',
        body: 'السلام عليكم أستاذ أحمد، رأيت أعمالك وأعجبتني كثيراً. هل أنت متاح لتصوير حفل خطوبة في 18 فبراير؟',
        createdAt: new Date(t1base), readAt: new Date(t1base + 1000 * 60 * 10),
      },
      {
        conversationId: conv1.id, senderId: createdPhotographers[0].id, senderRole: 'PHOTOGRAPHER',
        body: 'وعليكم السلام! شكراً لك. نعم أنا متاح في هذا التاريخ. ما هو مكان الحفل تقريباً؟',
        createdAt: new Date(t1base + 1000 * 60 * 15), readAt: new Date(t1base + 1000 * 60 * 20),
      },
      {
        conversationId: conv1.id, senderId: createdConsumers[0].id, senderRole: 'CLIENT',
        body: 'الحفل في الرياض، حي العليا. هل يمكنك إرسال تفاصيل الأسعار؟',
        createdAt: new Date(t1base + 1000 * 60 * 25), readAt: new Date(t1base + 1000 * 60 * 30),
      },
      {
        // Latest message: unread by عبدالله (readAt = null)
        conversationId: conv1.id, senderId: createdPhotographers[0].id, senderRole: 'PHOTOGRAPHER',
        body: 'بالتأكيد! السعر لـ 6 ساعات هو 3000 ريال يشمل التعديل والتسليم خلال أسبوع.',
        createdAt: new Date(t1base + 1000 * 60 * 40), readAt: null,
      },
    ],
  })
  await prisma.conversation.update({ where: { id: conv1.id }, data: { updatedAt: new Date(t1base + 1000 * 60 * 40) } })
  console.log('  ✅ محادثة 1: عبدالله ←→ أحمد (طلب مباشر)')

  // ── Conversation 2: PROJECT_BID ───────────────────────────────────────
  // ريم ←→ سارة الزهراني
  const conv2 = await prisma.conversation.create({
    data: {
      type: 'PROJECT_BID',
      consumerId: createdConsumers[1].id,
      photographerId: createdPhotographers[1].photographerProfile.id,
      projectId: createdProjects[1].id,
    },
  })
  const t2base = Date.now() - 1000 * 60 * 300
  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id, senderId: createdConsumers[1].id, senderRole: 'CLIENT',
        body: 'مرحباً سارة، رأيت عرضك على مشروع تصوير المنتجات. هل تعملين بالكميات الكبيرة؟',
        createdAt: new Date(t2base), readAt: new Date(t2base + 1000 * 60 * 10),
      },
      {
        conversationId: conv2.id, senderId: createdPhotographers[1].id, senderRole: 'PHOTOGRAPHER',
        body: 'مرحباً ريم! بالطبع، أملك استوديو مجهز يسمح بتصوير 20-30 منتجاً يومياً. هل المنتجات ملابس فقط؟',
        createdAt: new Date(t2base + 1000 * 60 * 20), readAt: new Date(t2base + 1000 * 60 * 30),
      },
      {
        // Latest message: unread by سارة (readAt = null)
        conversationId: conv2.id, senderId: createdConsumers[1].id, senderRole: 'CLIENT',
        body: 'نعم ملابس وإكسسوارات. هل يمكنك إرسال مثال من أعمالك السابقة في تصوير المنتجات؟',
        createdAt: new Date(t2base + 1000 * 60 * 35), readAt: null,
      },
    ],
  })
  await prisma.conversation.update({ where: { id: conv2.id }, data: { updatedAt: new Date(t2base + 1000 * 60 * 35) } })
  console.log('  ✅ محادثة 2: ريم ←→ سارة (عرض مشروع)')

  console.log('\n🎉 اكتملت التعبئة!\n')
  console.log('📋 بيانات الدخول (كلمة المرور لجميع الحسابات: password123)')
  console.log('المصورون:')
  photographers.forEach(p => console.log(`  📷 ${p.name} — ${p.email}`))
  console.log('العملاء:')
  consumers.forEach(c => console.log(`  👤 ${c.name} — ${c.email}`))
  console.log('\n💬 اختبار الرسائل:')
  console.log('  • عبدالله@example.sa → /messages → رسالة غير مقروءة من أحمد')
  console.log('  • sara@studio.sa     → /messages → رسالة غير مقروءة من ريم')
  console.log('\n💳 اختبار الاشتراك (TAP_MODE=mock):')
  console.log('  • yousuf@studio.sa (password123) → /pricing → ابدأ الاشتراك → زر DEV تأكيد → ACTIVE')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
