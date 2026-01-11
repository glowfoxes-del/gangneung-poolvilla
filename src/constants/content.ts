export const content = {
    siteConfig: {
        name: "강릉 풀빌라라 (Gangneung Poolvilla-ra)",
        description: "강릉 오션뷰 프라이빗 풀빌라, 자연 속 진정한 휴식.",
        keywords: ["강릉풀빌라", "오션뷰", "프라이빗풀", "커플펜션", "감성숙소"],
        url: "https://poolvilla-ra.com", // Dummy URL
        ogImage: "/og.jpg",
    },
    contact: {
        businessName: "강릉 풀빌라라",
        representative: "김대표",
        businessId: "123-45-67890",
        address: "강원특별자치도 강릉시 사천면 해안로 123",
        addressDetail: "풀빌라라",
        phone: "010-1234-5678",
        email: "contact@poolvilla.com",
        checkIn: "15:00",
        checkOut: "11:00",
        bankName: "농협은행",
        accountNumber: "351-0000-0000-00",
        accountHolder: "강릉풀빌라라",
    },
    navigation: {
        main: [
            { name: "객실안내", href: "/rooms" },
            { name: "실시간예약", href: "/booking" },
            { name: "부대시설", href: "/static/facilities" },
            { name: "오시는길", href: "/#location" }, // Anchor
        ],
        footer: [
            { name: "이용안내", href: "/static/terms" },
            { name: "개인정보처리방침", href: "/static/privacy" },
            { name: "환불규정", href: "/static/refund" },
            { name: "문의하기", href: "/static/contact" },
        ],
    },
    rooms: [
        {
            id: "ocean-suite-a",
            name: "오션 스위트 A",
            description: "탁 트인 일몰 뷰와 아늑한 자연광이 가득한 스위트 객실입니다.",
            basePrice: 290000,
            capacity: { standard: 2, max: 4 },
            composition: "침실 1, 거실, 프라이빗 풀, 테라스",
            features: ["일몰 뷰", "온수풀(유료)", "감성 조명"],
            images: ["/images/rooms/suite-a-1.jpg"], // Placeholder
            prices: {
                weekday: 290000,
                friday: 350000,
                weekend: 420000,
            },
        },
        {
            id: "ocean-suite-b",
            name: "오션 스위트 B",
            description: "넓은 프라이빗 풀과 스파 욕조를 갖춘 럭셔리 스위트입니다.",
            basePrice: 310000,
            capacity: { standard: 2, max: 4 },
            composition: "침실 1, 거실, 프라이빗 풀, 스파 욕조",
            features: ["오션뷰", "스파", "테라스"],
            images: ["/images/rooms/suite-b-1.jpg"],
            prices: {
                weekday: 310000,
                friday: 370000,
                weekend: 450000,
            },
        },
        {
            id: "family-poolvilla-c",
            name: "패밀리 풀빌라 C",
            description: "온 가족이 함께 즐길 수 있는 넉넉한 공간과 키즈 안전 가드를 갖춘 객실입니다.",
            basePrice: 390000,
            capacity: { standard: 4, max: 6 },
            composition: "침실 2, 거실, 대형 풀, 주방",
            features: ["대가족 추천", "키즈 안전가드", "넓은 주방"],
            images: ["/images/rooms/family-c-1.jpg"],
            prices: {
                weekday: 390000,
                friday: 450000,
                weekend: 520000,
            },
        },
        {
            id: "garden-poolvilla-d",
            name: "가든 풀빌라 D",
            description: "프라이빗 가든에서 즐기는 바비큐 파티와 힐링 타임.",
            basePrice: 260000,
            capacity: { standard: 2, max: 4 },
            composition: "침실 1, 거실, 가든 풀, 바비큐장",
            features: ["프라이빗 정원", "개별 바비큐", "숲세권"],
            images: ["/images/rooms/garden-d-1.jpg"],
            prices: {
                weekday: 260000,
                friday: 320000,
                weekend: 390000,
            },
        },
        {
            id: "rooftop-poolvilla-e",
            name: "루프탑 풀빌라 E",
            description: "하늘과 맞닿은 루프탑 풀에서 강릉의 밤하늘을 만끽하세요.",
            basePrice: 340000,
            capacity: { standard: 2, max: 4 },
            composition: "침실 1, 루프탑 풀, 테라스",
            features: ["루프탑", "별보기", "파노라마 뷰"],
            images: ["/images/rooms/rooftop-e-1.jpg"],
            prices: {
                weekday: 340000,
                friday: 410000,
                weekend: 490000,
            },
        },
        {
            id: "private-spa-f",
            name: "프라이빗 스파룸 F",
            description: "조용한 휴식을 원하는 커플을 위한 프라이빗 스파 전용 객실입니다.",
            basePrice: 240000,
            capacity: { standard: 2, max: 3 },
            composition: "원룸형, 대형 스파 욕조",
            features: ["실내 대형 스파", "아늑함", "가성비"],
            images: ["/images/rooms/spa-f-1.jpg"],
            prices: {
                weekday: 240000,
                friday: 290000,
                weekend: 350000,
            },
        },
    ],
    pricingRules: {
        baseGuestCount: 2,
        extraGuestSurcharge: 30000, // 인당 30,000원
        options: [
            { id: "bbq", name: "바비큐 세트", price: 30000, type: "PER_STAY" },
            { id: "warm_water", name: "온수풀 추가", price: 50000, type: "PER_STAY" },
        ],
    },
    policies: {
        checkIn: "오후 3:00",
        checkOut: "오전 11:00",
        refund: [
            { daysBefore: 7, refundRate: 100 },
            { daysBefore: 6, refundRate: 70 },
            { daysBefore: 3, refundRate: 70 },
            { daysBefore: 2, refundRate: 50 },
            { daysBefore: 1, refundRate: 50 },
            { daysBefore: 0, refundRate: 0 }, // 당일
        ],
        guidelines: [
            "실내 절대 금연입니다.",
            "반려동물 동반은 불가합니다.",
            "최대 인원 초과 시 입실이 불가합니다.",
            "22시 이후 소음 발생을 자제해 주세요.",
        ],
    },
} as const;

export type Content = typeof content;
