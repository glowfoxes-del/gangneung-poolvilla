import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        question: "예약 취소 및 환불 규정이 어떻게 되나요?",
        answer: "예약 취소는 이용일 7일 전까지 100% 환불 가능합니다. 이후 기간에 따라 환불 수수료가 차등 적용되니, 자세한 내용은 예약 페이지의 환불 규정을 참고해 주세요."
    },
    {
        question: "최대 인원을 초과해서 입실할 수 있나요?",
        answer: "쾌적한 이용과 안전을 위해 최대 인원을 초과한 입실은 엄격히 제한하고 있습니다. 예약 시 인원을 정확히 확인해 주시기 바랍니다."
    },
    {
        question: "바비큐 이용은 어떻게 하나요?",
        answer: "전 객실 개별 테라스에서 전기 그릴을 이용한 바비큐가 가능합니다. 그릴 대여료는 30,000원이며, 예약 시 옵션으로 선택하거나 현장에서 결제하실 수 있습니다."
    },
    {
        question: "주변에 마트나 편의점이 있나요?",
        answer: "차량 5분 거리에 24시간 편의점이 있으며, 차량 10분 거리 내에 대형 마트(하나로마트)가 위치해 있습니다."
    },
    {
        question: "반려동물 동반이 가능한가요?",
        answer: "죄송합니다. 쾌적한 객실 환경 유지를 위해 반려동물 동반 입실은 불가합니다."
    }
];

export function FAQ() {
    return (
        <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <span className="text-primary font-medium tracking-wider text-sm uppercase mb-2 block">FAQ</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
                    <p className="text-gray-600">
                        예약 전 궁금하신 사항을 미리 확인하세요.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full bg-white rounded-2xl shadow-sm px-6 py-4">
                    {FAQS.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-b-gray-100 last:border-0">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-primary transition-colors py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">더 궁금한 점이 있으신가요?</p>
                    <Button asChild variant="default" className="rounded-full px-8">
                        <Link href="/static/contact">문의하기</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
