import { content } from "@/constants/content";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPage() {
    const { policies } = content;

    return (
        <div className="container mx-auto py-16 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">환불 규정</h1>

            <div className="space-y-8">
                <Card>
                    <CardHeader className="bg-zinc-50 border-b">
                        <CardTitle>취소 수수료 안내</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/2 text-center">기준 (이용일 기준)</TableHead>
                                    <TableHead className="w-1/2 text-center">환불율</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {policies.refund.map((rule, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="text-center font-medium">
                                            {rule.daysBefore >= 7 ? `${rule.daysBefore}일 전 취소` :
                                                rule.daysBefore === 0 ? "당일 취소" :
                                                    `${rule.daysBefore}일 전 취소`}
                                        </TableCell>
                                        <TableCell className="text-center text-primary font-bold">
                                            {rule.refundRate}% 환불
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="prose prose-zinc max-w-none bg-gray-50 p-6 rounded-lg">
                    <h3>유의사항</h3>
                    <ul>
                        <li>예약 변경도 취소 후 재예약으로 간주되며 위 약관이 적용됩니다.</li>
                        <li>천재지변으로 인한 항공/선박 결항 시 증빙서류를 제출하시면 100% 환불 가능합니다.</li>
                        <li>환불 처리는 카드사 사정에 따라 3~7영업일 소요될 수 있습니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
