export default function TermsPage() {
    return (
        <div className="container mx-auto py-16 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">이용약관</h1>
            <div className="prose prose-zinc max-w-none">
                <h3>제1조 (목적)</h3>
                <p>
                    본 약관은 강릉 풀빌라라(이하 "펜션")가 제공하는 숙박 및 관련 서비스(이하 "서비스") 이용과 관련하여, 펜션과 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>

                <h3>제2조 (이용 계약)</h3>
                <p>
                    이용 계약은 이용자가 펜션이 정한 양식에 따라 예약 정보를 기입하고, 본 약관에 동의한다는 의사표시를 함으로써 체결됩니다.
                </p>

                <h3>제3조 (예약 및 결제)</h3>
                <p>
                    1. 예약은 홈페이지를 통한 실시간 예약을 원칙으로 합니다.<br />
                    2. 예약금 입금 후 예약 완료 문자를 받으시면 예약이 확정됩니다.
                </p>

                {/* More dummy text ... */}
                <h3>제4조 (환불 규정)</h3>
                <p>
                    환불 규정은 별도로 고지된 '환불 규정' 페이지를 따릅니다.
                </p>
            </div>
        </div>
    );
}
